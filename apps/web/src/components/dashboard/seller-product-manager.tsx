'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { clientFetch } from '@/lib/client-api';
import { currency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '../ui/button';

const productSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().min(1),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  unit: z.string().min(1),
  price: z.string().min(1),
  minOrderQuantity: z.string().min(1),
  inventoryQuantity: z.string().min(1),
  qualityGrade: z.string().min(1),
  originCity: z.string().optional(),
  originState: z.string().optional(),
  harvestDate: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const emptyValues: ProductFormValues = {
  name: '',
  categoryId: '',
  description: '',
  shortDescription: '',
  unit: 'kg',
  price: '',
  minOrderQuantity: '1',
  inventoryQuantity: '',
  qualityGrade: 'A',
  originCity: '',
  originState: '',
  harvestDate: '',
  imageUrl: '',
};

export function SellerProductManager({ products }: { products: any[] }) {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const categoriesQuery = useQuery({
    queryKey: ['categories-for-seller'],
    queryFn: () => clientFetch<Array<{ id: string; name: string }>>('/categories'),
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!editingProductId) {
      form.reset(emptyValues);
      return;
    }

    const product = products.find((item) => item.id === editingProductId);
    if (!product) {
      return;
    }

    form.reset({
      name: product.name,
      categoryId: product.categoryId,
      description: product.description,
      shortDescription: product.shortDescription ?? '',
      unit: product.unit,
      price: String(product.price),
      minOrderQuantity: String(product.minOrderQuantity),
      inventoryQuantity: String(product.inventoryQuantity),
      qualityGrade: product.qualityGrade,
      originCity: product.originCity ?? '',
      originState: product.originState ?? '',
      harvestDate: product.harvestDate ? new Date(product.harvestDate).toISOString().slice(0, 10) : '',
      imageUrl: product.images?.[0]?.url ?? '',
    });
  }, [editingProductId, form, products]);

  const saveMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (!token) throw new Error('Login required');
      const path = editingProductId ? `/seller/products/${editingProductId}` : '/seller/products';
      const method = editingProductId ? 'PATCH' : 'POST';
      return clientFetch(
        path,
        {
          method,
          body: JSON.stringify(values),
        },
        token,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/dashboard/seller', token] });
      toast.success(editingProductId ? 'Product updated' : 'Product created');
      setEditingProductId(null);
      form.reset(emptyValues);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to save product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!token) throw new Error('Login required');
      return clientFetch(`/seller/products/${productId}`, { method: 'DELETE' }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/dashboard/seller', token] });
      toast.success('Product deleted');
      if (editingProductId) {
        setEditingProductId(null);
        form.reset(emptyValues);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to delete product');
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="card-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
          {editingProductId ? (
            <button
              type="button"
              onClick={() => {
                setEditingProductId(null);
                form.reset(emptyValues);
              }}
              className="text-sm font-medium text-moss"
            >
              New product
            </button>
          ) : null}
        </div>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none md:col-span-2" placeholder="Product name" {...form.register('name')} />
          <select className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" {...form.register('categoryId')}>
            <option value="">Select category</option>
            {categoriesQuery.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Unit" {...form.register('unit')} />
          <textarea className="min-h-28 rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none md:col-span-2" placeholder="Description" {...form.register('description')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none md:col-span-2" placeholder="Short description" {...form.register('shortDescription')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Price" {...form.register('price')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Min order qty" {...form.register('minOrderQuantity')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Inventory quantity" {...form.register('inventoryQuantity')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Quality grade" {...form.register('qualityGrade')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Origin city" {...form.register('originCity')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Origin state" {...form.register('originState')} />
          <input type="date" className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" {...form.register('harvestDate')} />
          <input className="rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder="Image URL" {...form.register('imageUrl')} />
          <Button type="submit" className="md:col-span-2">
            {editingProductId ? 'Update Product' : 'Create Product'}
          </Button>
        </form>
      </div>
      <div className="card-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">Manage Products</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f7ef] px-4 py-2 text-sm font-medium text-black/70">
            <Plus className="h-4 w-4" />
            {products.length} products
          </div>
        </div>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl bg-[#f5f7ef] p-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <p className="font-semibold text-black">{product.name}</p>
                  <p className="mt-1 text-sm text-black/65">
                    {currency(product.price)} | {product.inventory?.availableQuantity ?? 0} units | Harvest {formatDate(product.harvestDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProductId(product.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-moss"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(product.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!products.length ? <p className="text-sm text-black/60">No products yet. Use the form to create the first listing.</p> : null}
        </div>
      </div>
    </div>
  );
}
