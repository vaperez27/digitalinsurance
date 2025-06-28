
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.policy.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.insuranceProduct.deleteMany();
  await prisma.insuranceType.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  console.log('✅ Datos existentes eliminados');

  // Crear países
  const countries = await Promise.all([
    prisma.country.create({
      data: {
        name: 'México',
        code: 'MX',
        currency: 'MXN',
        currencySymbol: '$',
        active: true
      }
    }),
    prisma.country.create({
      data: {
        name: 'Argentina',
        code: 'AR',
        currency: 'ARS',
        currencySymbol: '$',
        active: true
      }
    }),
    prisma.country.create({
      data: {
        name: 'Chile',
        code: 'CL',
        currency: 'CLP',
        currencySymbol: '$',
        active: true
      }
    }),
    prisma.country.create({
      data: {
        name: 'Perú',
        code: 'PE',
        currency: 'PEN',
        currencySymbol: 'S/',
        active: true
      }
    })
  ]);

  console.log('✅ Países creados');

  // Crear tipos de seguros
  const insuranceTypes = await Promise.all([
    prisma.insuranceType.create({
      data: {
        name: 'Auto',
        slug: 'auto',
        description: 'Seguros para vehículos particulares y comerciales',
        icon: 'Car',
        active: true
      }
    }),
    prisma.insuranceType.create({
      data: {
        name: 'Vida',
        slug: 'vida',
        description: 'Seguros de vida y beneficiarios',
        icon: 'Heart',
        active: true
      }
    }),
    prisma.insuranceType.create({
      data: {
        name: 'Salud',
        slug: 'salud',
        description: 'Seguros médicos y de gastos médicos mayores',
        icon: 'Shield',
        active: true
      }
    }),
    prisma.insuranceType.create({
      data: {
        name: 'Viaje',
        slug: 'viaje',
        description: 'Seguros para viajes nacionales e internacionales',
        icon: 'Plane',
        active: true
      }
    }),
    prisma.insuranceType.create({
      data: {
        name: 'Accidentes',
        slug: 'accidentes',
        description: 'Seguros contra accidentes personales',
        icon: 'AlertTriangle',
        active: true
      }
    })
  ]);

  console.log('✅ Tipos de seguros creados');

  // Crear productos de seguros
  const products = [];

  // Productos de AUTO
  const autoType = insuranceTypes.find(t => t.slug === 'auto')!;
  
  for (const country of countries) {
    products.push(
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro Auto Básico ${country.name}`,
          slug: `auto-basico-${country.code.toLowerCase()}`,
          description: 'Cobertura básica para tu vehículo con responsabilidad civil',
          basePrice: country.code === 'MX' ? 3500 : country.code === 'AR' ? 45000 : country.code === 'CL' ? 85000 : 180,
          currency: country.currency,
          insuranceTypeId: autoType.id,
          countryId: country.id,
          company: 'AXA Seguros',
          companyLogo: 'https://i.pinimg.com/originals/2c/3a/97/2c3a979b721fc10cf6065d3d5f3286ac.jpg',
          features: [
            'Responsabilidad Civil',
            'Gastos Médicos',
            'Defensa Jurídica',
            'Asistencia Vial 24/7'
          ],
          coverage: {
            responsabilidadCivil: '1,000,000',
            gastosMedicos: '100,000',
            asistencoaVial: true,
            defensaJuridica: true
          },
          deductible: 5000,
          minAge: 18,
          maxAge: 75,
          active: true
        }
      }),
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro Auto Premium ${country.name}`,
          slug: `auto-premium-${country.code.toLowerCase()}`,
          description: 'Cobertura amplia con todo riesgo para tu vehículo',
          basePrice: country.code === 'MX' ? 8500 : country.code === 'AR' ? 115000 : country.code === 'CL' ? 195000 : 420,
          currency: country.currency,
          insuranceTypeId: autoType.id,
          countryId: country.id,
          company: 'MAPFRE',
          companyLogo: 'https://cdn-reviews.supermoney.com/businesses/2/mapfre-insurance_social.png',
          features: [
            'Cobertura Amplia',
            'Daños Materiales',
            'Robo Total',
            'Cristales',
            'Auto Sustituto',
            'Asistencia Vial Premium'
          ],
          coverage: {
            responsabilidadCivil: '2,000,000',
            gastosMedicos: '200,000',
            dañosMateriales: true,
            roboTotal: true,
            cristales: true,
            autoSustituto: true
          },
          deductible: 3000,
          minAge: 21,
          maxAge: 70,
          active: true
        }
      })
    );
  }

  // Productos de VIDA
  const vidaType = insuranceTypes.find(t => t.slug === 'vida')!;
  
  for (const country of countries) {
    products.push(
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro de Vida Familiar ${country.name}`,
          slug: `vida-familiar-${country.code.toLowerCase()}`,
          description: 'Protección económica para tu familia',
          basePrice: country.code === 'MX' ? 1200 : country.code === 'AR' ? 15000 : country.code === 'CL' ? 28000 : 65,
          currency: country.currency,
          insuranceTypeId: vidaType.id,
          countryId: country.id,
          company: 'MetLife',
          companyLogo: 'https://i.pinimg.com/736x/5b/f3/09/5bf309e212129b2366c84ba92371d4c0.jpg',
          features: [
            'Muerte por Cualquier Causa',
            'Muerte Accidental',
            'Invalidez Total y Permanente',
            'Enfermedades Graves'
          ],
          coverage: {
            sumAsegurada: '500,000',
            muerteAccidental: '1,000,000',
            invalidezTotal: '500,000',
            enfermedadesGraves: '100,000'
          },
          minAge: 18,
          maxAge: 65,
          active: true
        }
      }),
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro de Vida Ejecutivo ${country.name}`,
          slug: `vida-ejecutivo-${country.code.toLowerCase()}`,
          description: 'Protección premium para ejecutivos y profesionales',
          basePrice: country.code === 'MX' ? 2800 : country.code === 'AR' ? 38000 : country.code === 'CL' ? 72000 : 155,
          currency: country.currency,
          insuranceTypeId: vidaType.id,
          countryId: country.id,
          company: 'Allianz',
          companyLogo: 'https://play-lh.googleusercontent.com/yjHeneNy3LahatwSEh5AoujxpixXTZeD3w4hd7J49q9aW5IwTu6r8WhobMD3cSufWA',
          features: [
            'Alta Suma Asegurada',
            'Cobertura Mundial',
            'Beneficios en Vida',
            'Asistencia Médica Premium',
            'Asesoría Financiera'
          ],
          coverage: {
            sumAsegurada: '2,000,000',
            muerteAccidental: '4,000,000',
            invalidezTotal: '2,000,000',
            enfermedadesGraves: '500,000',
            beneficiosEnVida: true
          },
          minAge: 25,
          maxAge: 60,
          active: true
        }
      })
    );
  }

  // Productos de SALUD
  const saludType = insuranceTypes.find(t => t.slug === 'salud')!;
  
  for (const country of countries) {
    products.push(
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro de Salud Individual ${country.name}`,
          slug: `salud-individual-${country.code.toLowerCase()}`,
          description: 'Cobertura médica individual con red de hospitales',
          basePrice: country.code === 'MX' ? 2500 : country.code === 'AR' ? 32000 : country.code === 'CL' ? 62000 : 135,
          currency: country.currency,
          insuranceTypeId: saludType.id,
          countryId: country.id,
          company: 'Seguros Monterrey',
          companyLogo: 'https://i.pinimg.com/736x/95/9e/49/959e49e3e565dd3041f3ef09bedf6940.jpg',
          features: [
            'Hospitalización',
            'Cirugías',
            'Consultas Médicas',
            'Medicamentos',
            'Estudios de Laboratorio'
          ],
          coverage: {
            hospitalizacion: '500,000',
            cirugias: '300,000',
            consultasMedicas: '50,000',
            medicamentos: '25,000',
            laboratorios: '15,000'
          },
          deductible: 2500,
          minAge: 18,
          maxAge: 70,
          active: true
        }
      }),
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro de Salud Familiar ${country.name}`,
          slug: `salud-familiar-${country.code.toLowerCase()}`,
          description: 'Cobertura médica para toda la familia',
          basePrice: country.code === 'MX' ? 5800 : country.code === 'AR' ? 75000 : country.code === 'CL' ? 145000 : 320,
          currency: country.currency,
          insuranceTypeId: saludType.id,
          countryId: country.id,
          company: 'Bupa',
          companyLogo: 'https://www.internationalinsurance.com/wp-content/uploads/2018/02/bupa-global-logo-square.png',
          features: [
            'Cobertura Familiar (4 miembros)',
            'Maternidad',
            'Pediatría',
            'Medicina Preventiva',
            'Telemedicina',
            'Red Internacional'
          ],
          coverage: {
            hospitalizacion: '1,000,000',
            cirugias: '800,000',
            maternidad: '100,000',
            pediatria: '150,000',
            medicinaPreventiva: '25,000',
            telemedicina: true
          },
          deductible: 5000,
          minAge: 0,
          maxAge: 75,
          active: true
        }
      })
    );
  }

  // Productos de VIAJE
  const viajeType = insuranceTypes.find(t => t.slug === 'viaje')!;
  
  for (const country of countries) {
    products.push(
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro de Viaje Nacional ${country.name}`,
          slug: `viaje-nacional-${country.code.toLowerCase()}`,
          description: 'Protección para viajes dentro del país',
          basePrice: country.code === 'MX' ? 150 : country.code === 'AR' ? 2500 : country.code === 'CL' ? 4800 : 12,
          currency: country.currency,
          insuranceTypeId: viajeType.id,
          countryId: country.id,
          company: 'Travel Ace',
          companyLogo: 'https://yt3.googleusercontent.com/ytc/AIdro_n1lHkXWlGqgZFCBejUFkEp76NNjdq1AfqB8hEuV-8j_MY=s900-c-k-c0x00ffffff-no-rj',
          features: [
            'Gastos Médicos',
            'Cancelación de Viaje',
            'Pérdida de Equipaje',
            'Asistencia 24/7'
          ],
          coverage: {
            gastosMedicos: '50,000',
            cancelacionViaje: '25,000',
            perdidaEquipaje: '10,000',
            asistencia24h: true
          },
          active: true
        }
      }),
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro de Viaje Internacional ${country.name}`,
          slug: `viaje-internacional-${country.code.toLowerCase()}`,
          description: 'Cobertura completa para viajes al extranjero',
          basePrice: country.code === 'MX' ? 450 : country.code === 'AR' ? 7500 : country.code === 'CL' ? 14500 : 35,
          currency: country.currency,
          insuranceTypeId: viajeType.id,
          countryId: country.id,
          company: 'Mondial Assistance',
          companyLogo: 'https://play-lh.googleusercontent.com/3peWKsNHaYBuqXtsl7irb9K1QbeeYgfFoOwzC2TbPVUNEcxkxLRb_LxuHvDaUfyjTg',
          features: [
            'Gastos Médicos en el Extranjero',
            'Repatriación Sanitaria',
            'Cancelación de Viaje',
            'Pérdida de Equipaje',
            'Responsabilidad Civil',
            'Asistencia Legal'
          ],
          coverage: {
            gastosMedicosExtranjero: '250,000',
            repatriacion: '1,000,000',
            cancelacionViaje: '100,000',
            perdidaEquipaje: '25,000',
            responsabilidadCivil: '100,000'
          },
          active: true
        }
      })
    );
  }

  // Productos de ACCIDENTES
  const accidentesType = insuranceTypes.find(t => t.slug === 'accidentes')!;
  
  for (const country of countries) {
    products.push(
      await prisma.insuranceProduct.create({
        data: {
          name: `Seguro de Accidentes Personales ${country.name}`,
          slug: `accidentes-personales-${country.code.toLowerCase()}`,
          description: 'Protección contra accidentes en cualquier lugar',
          basePrice: country.code === 'MX' ? 850 : country.code === 'AR' ? 12000 : country.code === 'CL' ? 23000 : 48,
          currency: country.currency,
          insuranceTypeId: accidentesType.id,
          countryId: country.id,
          company: 'Seguros SURA',
          companyLogo: 'https://play-lh.googleusercontent.com/u6SbUHUFYzDa_WjhaexamUqW6-VdrG1aADgtF_3qkeHNSRTvoW4X9QzgJwUOo5wftQ',
          features: [
            'Muerte Accidental',
            'Invalidez Permanente',
            'Gastos Médicos por Accidente',
            'Incapacidad Temporal',
            'Gastos Funerarios'
          ],
          coverage: {
            muerteAccidental: '300,000',
            invalidezPermanente: '300,000',
            gastosMedicos: '75,000',
            incapacidadTemporal: '2,000',
            gastosFunerarios: '15,000'
          },
          minAge: 18,
          maxAge: 70,
          active: true
        }
      })
    );
  }

  console.log('✅ Productos de seguros creados');

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@seguros.com',
      password: adminPassword,
      role: 'admin',
      countryId: countries[0].id // México
    }
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@doe.com',
      password: hashedPassword,
      role: 'admin', // Admin privileges as required
      phone: '+52 55 1234 5678',
      document: 'CURP123456789',
      countryId: countries[0].id // México
    }
  });

  // Crear carrito para el usuario demo
  await prisma.cart.create({
    data: {
      userId: demoUser.id
    }
  });

  console.log('✅ Usuarios de prueba creados');
  console.log(`📧 Usuario demo: john@doe.com / johndoe123 (admin)`);
  console.log(`📧 Usuario admin: admin@seguros.com / admin123`);

  console.log('🎉 Seed completado exitosamente!');
  
  console.log('\n📊 Resumen:');
  console.log(`- ${countries.length} países creados`);
  console.log(`- ${insuranceTypes.length} tipos de seguros creados`);
  console.log(`- ${products.length} productos de seguros creados`);
  console.log('- 2 usuarios de prueba creados');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
