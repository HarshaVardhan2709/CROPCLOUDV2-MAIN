import * as argon2 from 'argon2';
import { AdminApprovalStatus, DeliveryMode, PaymentMethod, PrismaClient, RoleType, SellerStatus, ProductApprovalStatus } from '@prisma/client';
 
const prisma = new PrismaClient();
 
async function main() {
  await prisma.verificationCode.deleteMany();
  await prisma.traceabilityEvent.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.address.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.sellerPayout.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.category.deleteMany();
 
  // ✅ ADD THIS LINE (VERY IMPORTANT)
  await prisma.loginLog.deleteMany();
 
  // ✅ THEN delete users
  await prisma.user.deleteMany();
 
  await prisma.role.deleteMany();
 
  const roles = await Promise.all(
    Object.values(RoleType).map((name) => prisma.role.create({ data: { name } })),
  );
  const roleMap = Object.fromEntries(roles.map((role) => [role.name, role.id]));
  const passwords = {
    admin: await argon2.hash('Admin@123'),
    buyer: await argon2.hash('Buyer@123'),
    seller: await argon2.hash('Seller@123'),
    logistics: await argon2.hash('Logistics@123'),
  };
 
  const admin = await prisma.user.create({
    data: {
      email: 'admin@cropcloud.dev',
      fullName: 'CropCloud Admin',
      passwordHash: passwords.admin,
      roleId: roleMap.ADMIN,
      isPrimaryAdmin: true,
      adminApprovalStatus: AdminApprovalStatus.APPROVED,
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });
 
  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@cropcloud.dev',
      fullName: 'FreshKart Procurement',
      passwordHash: passwords.buyer,
      roleId: roleMap.BUYER,
      buyerProfile: {
        create: {
          companyName: 'FreshKart Retail',
          businessType: 'Retailer',
          preferredCity: 'Bengaluru',
          latitude: 12.9716,
          longitude: 77.5946,
        },
      },
      addresses: {
        create: {
          label: 'Warehouse',
          line1: 'Hi-Tech City, Phase 1',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500072',
          latitude: 17.3850,
          longitude: 78.4867,
          isDefault: true,
        },
      },
      cart: { create: {} },
      wishlist: { create: {} },
    },
    include: { addresses: true },
  });
 
  const seller = await prisma.user.create({
    data: {
      email: 'seller@cropcloud.dev',
      fullName: 'Hyderabad Fresh Farms',
      passwordHash: passwords.seller,
      roleId: roleMap.SELLER,
      sellerProfile: {
        create: {
          businessName: 'Hyderabad Fresh Farms',
          farmName: 'Musi River Valley Farm',
          description: 'Premium vegetables and leafy greens for retail and wholesale buyers across Telangana.',
          organicCertified: true,
          approvalStatus: SellerStatus.APPROVED,
          latitude: 17.3850,
          longitude: 78.4867,
          city: 'Hyderabad',
          state: 'Telangana',
          serviceRadiusKm: 250,
        },
      },
      cart: { create: {} },
      wishlist: { create: {} },
    },
    include: { sellerProfile: true },
  });
 
  const seller2 = await prisma.user.create({
    data: {
      email: 'seller2@cropcloud.dev',
      fullName: 'Warangal Agro Collective',
      passwordHash: passwords.seller,
      roleId: roleMap.SELLER,
      sellerProfile: {
        create: {
          businessName: 'Warangal Agro Collective',
          farmName: 'Godavari Valley Farms',
          description: 'Premium fruits and spices for exporters and institutional buyers across Telangana region.',
          approvalStatus: SellerStatus.APPROVED,
          latitude: 17.9689,
          longitude: 79.5941,
          city: 'Warangal',
          state: 'Telangana',
          serviceRadiusKm: 300,
        },
      },
      cart: { create: {} },
      wishlist: { create: {} },
    },
    include: { sellerProfile: true },
  });
 
  await prisma.user.create({
    data: {
      email: 'logistics@cropcloud.dev',
      fullName: 'TransitOps Partner',
      passwordHash: passwords.logistics,
      roleId: roleMap.LOGISTICS,
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });
 
  const [vegetables, fruits, grains, spices, dairy] = await Promise.all([
    prisma.category.create({ data: { name: 'Vegetables', slug: 'vegetables', featured: true, imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80' } }),
    prisma.category.create({ data: { name: 'Fruits', slug: 'fruits', featured: true, imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80' } }),
    prisma.category.create({ data: { name: 'Grains', slug: 'grains', imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80' } }),
    prisma.category.create({ data: { name: 'Spices', slug: 'spices', imageUrl: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80' } }),
    prisma.category.create({ data: { name: 'Dairy', slug: 'dairy', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80' } }),
  ]);
 
  await prisma.banner.createMany({
    data: [
      {
        title: 'Farm-direct produce for modern buyers',
        subtitle: 'Verified farmers, transparent pricing, traceable lots.',
        imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80',
        ctaLabel: 'Shop now',
        ctaLink: '/shop',
        sectionKey: 'hero',
        sortOrder: 1,
      },
      {
        title: 'Seasonal deals on leafy greens',
        subtitle: 'Daily dispatch windows from approved farms across Telangana.',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=1920&q=80',
        ctaLabel: 'Explore deals',
        ctaLink: '/shop?sort=price_asc',
        sectionKey: 'hero',
        sortOrder: 2,
      },
      {
        title: 'Exporter-grade fruits from Warangal',
        subtitle: 'Bulk lots with quality records and dispatch updates.',
        imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1920&q=80',
        ctaLabel: 'View fruits',
        ctaLink: '/category/fruits',
        sectionKey: 'deals',
        sortOrder: 3,
      },
    ],
  });
 
  await prisma.deliveryZone.createMany({
    data: [
      {
        sellerProfileId: seller.sellerProfile!.id,
        mode: DeliveryMode.PINCODE,
        label: 'Hyderabad Metro',
        pincode: '500072',
        estimatedDays: 1,
      },
      {
        sellerProfileId: seller.sellerProfile!.id,
        mode: DeliveryMode.PINCODE,
        label: 'Secunderabad Urban',
        pincode: '500001',
        estimatedDays: 1,
      },
      {
        sellerProfileId: seller.sellerProfile!.id,
        mode: DeliveryMode.PINCODE,
        label: 'Rangareddy District',
        pincode: '501401',
        estimatedDays: 1,
      },
      {
        sellerProfileId: seller.sellerProfile!.id,
        mode: DeliveryMode.PINCODE,
        label: 'Medchal Malkajgiri',
        pincode: '500047',
        estimatedDays: 1,
      },
      {
        sellerProfileId: seller.sellerProfile!.id,
        mode: DeliveryMode.RADIUS,
        label: 'Greater Hyderabad Coverage',
        centerLatitude: 17.3850,
        centerLongitude: 78.4867,
        radiusKm: 100,
        estimatedDays: 2,
      },
      {
        sellerProfileId: seller2.sellerProfile!.id,
        mode: DeliveryMode.PINCODE,
        label: 'Warangal Urban',
        pincode: '506001',
        estimatedDays: 1,
      },
      {
        sellerProfileId: seller2.sellerProfile!.id,
        mode: DeliveryMode.PINCODE,
        label: 'Karimnagar District',
        pincode: '505001',
        estimatedDays: 1,
      },
      {
        sellerProfileId: seller2.sellerProfile!.id,
        mode: DeliveryMode.RADIUS,
        label: 'North Telangana Coverage',
        centerLatitude: 17.9689,
        centerLongitude: 79.5941,
        radiusKm: 150,
        estimatedDays: 2,
      },
    ],
  });
 
  const lettuce = await prisma.product.create({
    data: {
      sellerProfileId: seller.sellerProfile!.id,
      categoryId: vegetables.id,
      name: 'Hydroponic Lettuce',
      slug: 'hydroponic-lettuce',
      description: 'Crisp hydroponic lettuce heads grown in controlled shade-net conditions.',
      shortDescription: 'Fresh premium lettuce for hotels and premium retailers.',
      unit: 'kg',
      price: 140,
      minOrderQuantity: 5,
      inventoryQuantity: 220,
      harvestDate: new Date('2026-03-04T00:00:00.000Z'),
      qualityGrade: 'A',
      organicCertified: true,
      originCity: 'Hyderabad',
      originState: 'Telangana',
      featured: true,
      bestDeal: true,
      seasonal: true,
      approvalStatus: ProductApprovalStatus.APPROVED,
      approvedAt: new Date(),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80', sortOrder: 2 },
        ],
      },
      inventory: {
        create: {
          availableQuantity: 220,
          reservedQuantity: 0,
          lowStockThreshold: 25,
        },
      },
      batches: {
        create: {
          batchCode: 'LET-0304-A1',
          harvestDate: new Date('2026-03-04T00:00:00.000Z'),
          packagingDate: new Date('2026-03-05T00:00:00.000Z'),
          qualityCheckStatus: 'Passed',
          quantity: 220,
          traceabilityEvents: {
            create: [
              { title: 'Harvest completed', status: 'harvested', description: 'Morning harvest from greenhouse block B.', eventAt: new Date('2026-03-04T05:30:00.000Z') },
              { title: 'Quality check', status: 'quality_checked', description: 'Moisture and residue parameters approved.', eventAt: new Date('2026-03-04T10:15:00.000Z') },
              { title: 'Packed for cold chain', status: 'packed', description: 'Packed into insulated crates.', eventAt: new Date('2026-03-05T07:45:00.000Z') },
            ],
          },
        },
      },
    },
  });
 
  const tomato = await prisma.product.create({
    data: {
      sellerProfileId: seller.sellerProfile!.id,
      categoryId: vegetables.id,
      name: 'Premium Tomato',
      slug: 'premium-tomato',
      description: 'Uniform red tomatoes suitable for retail shelves and processors.',
      shortDescription: 'Consistent size, weekly availability.',
      unit: 'kg',
      price: 48,
      minOrderQuantity: 20,
      inventoryQuantity: 560,
      harvestDate: new Date('2026-03-02T00:00:00.000Z'),
      qualityGrade: 'A',
      originCity: 'Hyderabad',
      originState: 'Telangana',
      featured: true,
      bestDeal: true,
      approvalStatus: ProductApprovalStatus.APPROVED,
      approvedAt: new Date(),
      images: { create: [{ url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&q=80', sortOrder: 1 }] },
      inventory: { create: { availableQuantity: 560, reservedQuantity: 0, lowStockThreshold: 80 } },
    },
  });
 
  const grapes = await prisma.product.create({
    data: {
      sellerProfileId: seller2.sellerProfile!.id,
      categoryId: fruits.id,
      name: 'Export Grade Green Grapes',
      slug: 'export-grade-green-grapes',
      description: 'Residue-tested green grapes packed for bulk wholesale and export programs.',
      shortDescription: 'Traceable lots with exporter-ready sorting.',
      unit: 'box',
      price: 780,
      minOrderQuantity: 10,
      inventoryQuantity: 90,
      harvestDate: new Date('2026-03-01T00:00:00.000Z'),
      qualityGrade: 'Export',
      originCity: 'Nashik',
      originState: 'Maharashtra',
      featured: true,
      seasonal: true,
      approvalStatus: ProductApprovalStatus.APPROVED,
      approvedAt: new Date(),
      images: { create: [{ url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80', sortOrder: 1 }] },
      inventory: { create: { availableQuantity: 90, reservedQuantity: 0, lowStockThreshold: 12 } },
      batches: {
        create: {
          batchCode: 'GRP-0301-X1',
          harvestDate: new Date('2026-03-01T00:00:00.000Z'),
          packagingDate: new Date('2026-03-03T00:00:00.000Z'),
          qualityCheckStatus: 'Exporter approved',
          quantity: 90,
          traceabilityEvents: {
            create: [
              { title: 'Farm harvest', status: 'harvested', description: 'Block 4 premium cluster pick.', eventAt: new Date('2026-03-01T06:00:00.000Z') },
              { title: 'Sulphur pad packing', status: 'packed', description: 'Prepared for long-haul cold chain.', eventAt: new Date('2026-03-03T08:30:00.000Z') },
            ],
          },
        },
      },
    },
  });
 
  await prisma.product.create({
    data: {
      sellerProfileId: seller2.sellerProfile!.id,
      categoryId: grains.id,
      name: 'Bulk Sorghum Grain',
      slug: 'bulk-sorghum-grain',
      description: 'Cleaned sorghum grain for food processing and institutional demand.',
      shortDescription: 'Moisture-tested grain lots.',
      unit: 'quintal',
      price: 3250,
      minOrderQuantity: 5,
      inventoryQuantity: 55,
      qualityGrade: 'A',
      originCity: 'Nashik',
      originState: 'Maharashtra',
      approvalStatus: ProductApprovalStatus.APPROVED,
      approvedAt: new Date(),
      images: { create: [{ url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', sortOrder: 1 }] },
      inventory: { create: { availableQuantity: 55, reservedQuantity: 0, lowStockThreshold: 10 } },
    },
  });
 
  await prisma.product.create({
    data: {
      sellerProfileId: seller.sellerProfile!.id,
      categoryId: spices.id,
      name: 'Turmeric Finger Premium',
      slug: 'turmeric-finger-premium',
      description: 'Sun-dried turmeric fingers with strong color value for spice buyers.',
      shortDescription: 'High-curcumin turmeric lots.',
      unit: 'kg',
      price: 132,
      minOrderQuantity: 25,
      inventoryQuantity: 340,
      qualityGrade: 'A',
      originCity: 'Mysuru',
      originState: 'Karnataka',
      approvalStatus: ProductApprovalStatus.APPROVED,
      approvedAt: new Date(),
      images: { create: [{ url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80', sortOrder: 1 }] },
      inventory: { create: { availableQuantity: 340, reservedQuantity: 0, lowStockThreshold: 30 } },
    },
  });
 
  await prisma.product.create({
    data: {
      sellerProfileId: seller.sellerProfile!.id,
      categoryId: dairy.id,
      name: 'Farm Fresh A2 Ghee',
      slug: 'farm-fresh-a2-ghee',
      description: 'Slow-churned A2 ghee for premium grocery and institutional kitchens.',
      shortDescription: 'Small-batch prepared and tested.',
      unit: 'jar',
      price: 690,
      minOrderQuantity: 12,
      inventoryQuantity: 75,
      qualityGrade: 'Premium',
      originCity: 'Mysuru',
      originState: 'Karnataka',
      images: { create: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80', sortOrder: 1 }] },
      inventory: { create: { availableQuantity: 75, reservedQuantity: 0, lowStockThreshold: 10 } },
    },
  });
 
  await prisma.review.createMany({
    data: [
      { userId: buyer.id, productId: lettuce.id, rating: 5, comment: 'Consistently fresh and well packed.' },
      { userId: buyer.id, productId: tomato.id, rating: 4, comment: 'Good shelf life and uniform grading.' },
      { userId: buyer.id, productId: grapes.id, rating: 5, comment: 'Excellent quality for export contracts.' },
    ],
  });
 
  await prisma.notification.createMany({
    data: [
      { userId: buyer.id, title: 'Seasonal deal live', body: 'Hydroponic lettuce is now available at launch pricing.' },
      { userId: seller.id, title: 'Seller profile approved', body: 'Your seller account is approved and visible to buyers.' },
      { userId: admin.id, title: 'Marketplace ready', body: 'Seed data loaded successfully.' },
    ],
  });
 
  const wishlist = await prisma.wishlist.findUniqueOrThrow({ where: { userId: buyer.id } });
  const cart = await prisma.cart.findUniqueOrThrow({ where: { userId: buyer.id } });
 
  await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId: grapes.id,
    },
  });
 
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: lettuce.id,
      quantity: 5,
    },
  });
 
  await prisma.sellerPayout.create({
    data: {
      sellerProfileId: seller.sellerProfile!.id,
      amount: 12500,
      status: 'scheduled',
      reference: 'PAY-CC-001',
    },
  });
 
  await prisma.order.create({
    data: {
      orderNumber: 'CC-DEMO-1001',
      buyerId: buyer.id,
      addressId: buyer.addresses[0].id,
      subtotal: 700,
      platformFee: 17.5,
      deliveryFee: 40,
      total: 757.5,
      paymentMethod: PaymentMethod.COD,
      status: 'IN_TRANSIT',
      estimatedDeliveryAt: new Date('2026-03-08T00:00:00.000Z'),
      items: {
        create: {
          productId: lettuce.id,
          sellerId: seller.sellerProfile!.id,
          quantity: 5,
          unitPrice: 140,
          totalPrice: 700,
        },
      },
      payments: {
        create: {
          method: PaymentMethod.COD,
          status: 'PAID',
          amount: 757.5,
        },
      },
    },
  });
}
 
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });