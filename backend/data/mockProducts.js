// backend/mockProducts.js

// Certifique-se de que estas imagens existam em public/images/ com os nomes correspondentes
const products = [
  // Laticínios
  {
    id: '1',
    name: 'Leite Integral UHT Caixa 1L',
    price: 5.49,
    image: '/images/caixa-leite.jpg',
    category: 'Laticínios',
    description: 'Leite integral UHT de longa duração, prático para o dia a dia, caixa com 1 litro.',
    countInStock: 150,
  },
  {
    id: '2',
    name: 'Queijo Prato Fatiado Pacote 200g',
    price: 12.90,
    image: '/images/queijo-prato-fatiado-200g.jpg',
    category: 'Laticínios',
    description: 'Queijo prato de alta qualidade, já fatiado para sua conveniência, pacote com 200 gramas.',
    countInStock: 40,
  },
  {
    id: '3',
    name: 'Iogurte Natural Integral Copo 170g',
    price: 3.20,
    image: '/images/iogurte-natural-integral-170g.jpg',
    category: 'Laticínios',
    description: 'Iogurte natural integral, cremoso e saudável, copo com 170 gramas.',
    countInStock: 80,
  },
  {
    id: '17', // Novo ID
    name: 'Manteiga com Sal Pote 200g',
    price: 9.50,
    image: '/images/manteiga-com-sal-200g.jpg',
    category: 'Laticínios',
    description: 'Manteiga de primeira qualidade com sal, ideal para pães e receitas, pote com 200 gramas.',
    countInStock: 50,
  },
  {
    id: '18', // Novo ID
    name: 'Leite Fermentado Frasco 80g',
    price: 2.50,
    image: '/images/leite-fermentado-80g.jpg',
    category: 'Laticínios',
    description: 'Leite fermentado com lactobacilos vivos, frasco com 80 gramas.',
    countInStock: 120,
  },

  // Limpeza
  {
    id: '4', // Mantendo ID se já existia e era este o produto
    name: 'Detergente Líquido Neutro 500ml',
    price: 2.80,
    image: '/images/detergente-liquido-neutro-500ml.jpg',
    category: 'Limpeza',
    description: 'Detergente líquido neutro, alta eficiência na remoção de gordura, frasco com 500ml.',
    countInStock: 90,
  },
  {
    id: '5',
    name: 'Água Sanitária Tradicional 1L',
    price: 4.50,
    image: '/images/agua-sanitaria-1l.jpg',
    category: 'Limpeza',
    description: 'Água sanitária com cloro ativo, poderosa na desinfecção e limpeza, frasco com 1 litro.',
    countInStock: 70,
  },
  {
    id: '19', // Novo ID
    name: 'Sabão em Pó Multiação Caixa 1kg',
    price: 15.75,
    image: '/images/sabao-em-po-multiacao-1kg.jpg',
    category: 'Limpeza',
    description: 'Sabão em pó para lavagem de roupas, remove manchas e perfuma, caixa com 1kg.',
    countInStock: 60,
  },
  {
    id: '20', // Novo ID
    name: 'Limpador Multiuso Perfumado 500ml',
    price: 7.90,
    image: '/images/limpador-multiuso-perfumado-500ml.jpg',
    category: 'Limpeza',
    description: 'Limpador multiuso com perfume floral, ideal para diversas superfícies, frasco com 500ml.',
    countInStock: 45,
  },

  // Padaria
  {
    id: '6',
    name: 'Pão Francês (unidade)',
    price: 0.85,
    image: '/images/pao-frances-unidade.jpg',
    category: 'Padaria',
    description: 'Pão francês fresquinho e crocante, vendido por unidade.',
    countInStock: 200,
  },
  {
    id: '7',
    name: 'Pão de Forma Integral Pacote 500g',
    price: 8.99,
    image: '/images/pao-de-forma-integral-500g.jpg',
    category: 'Padaria',
    description: 'Pão de forma integral, macio e nutritivo, ideal para sanduíches, pacote com 500 gramas.',
    countInStock: 30,
  },
  {
    id: '21', // Novo ID
    name: 'Bolo de Cenoura com Cobertura Pedaço',
    price: 6.50,
    image: '/images/bolo-cenoura-cobertura-pedaco.jpg',
    category: 'Padaria',
    description: 'Delicioso pedaço de bolo de cenoura fofinho com cobertura de chocolate.',
    countInStock: 15,
  },
  {
    id: '22', // Novo ID
    name: 'Broa de Milho Caxambu (unidade)',
    price: 3.00,
    image: '/images/broa-milho-caxambu.jpg',
    category: 'Padaria',
    description: 'Broa de milho caxambu tradicional, sabor da fazenda.',
    countInStock: 25,
  },

  // Hortifruti
  {
    id: '8',
    name: 'Maçã Fuji (kg)',
    price: 7.99,
    image: '/images/maca-fuji-kg.jpg',
    category: 'Hortifruti',
    description: 'Maçã Fuji selecionada e suculenta, vendida por quilo.',
    countInStock: 50, // Representa 50kg disponíveis
  },
  {
    id: '9',
    name: 'Banana Prata (dúzia)',
    price: 6.50,
    image: '/images/banana-prata-duzia.jpg',
    category: 'Hortifruti',
    description: 'Banana prata fresca e saborosa, vendida em dúzia.',
    countInStock: 40, // Representa 40 dúzias
  },
  {
    id: '10',
    name: 'Alface Crespa (unidade)',
    price: 3.50,
    image: '/images/alface-crespa-unidade.jpg',
    category: 'Hortifruti',
    description: 'Alface crespa hidropônica, folhas frescas e crocantes, vendida por unidade.',
    countInStock: 30,
  },
  {
    id: '23', // Novo ID
    name: 'Tomate Italiano Maduro (kg)',
    price: 8.90,
    image: '/images/tomate-italiano-kg.jpg',
    category: 'Hortifruti',
    description: 'Tomate italiano maduro e saboroso, ideal para molhos e saladas, vendido por quilo.',
    countInStock: 45, // 45kg
  },
  {
    id: '24', // Novo ID
    name: 'Batata Inglesa Lavada (kg)',
    price: 5.99,
    image: '/images/batata-inglesa-kg.jpg',
    category: 'Hortifruti',
    description: 'Batata inglesa de ótima qualidade, já lavada, vendida por quilo.',
    countInStock: 100, // 100kg
  },

  // Bebidas
  {
    id: '11',
    name: 'Refrigerante Guaraná Garrafa 2L',
    price: 7.00,
    image: '/images/refrigerante-guarana-2l.jpg',
    category: 'Bebidas',
    description: 'Refrigerante sabor guaraná, refrescante e tradicional, garrafa PET 2 litros.',
    countInStock: 75,
  },
  {
    id: '12',
    name: 'Suco de Uva Integral Garrafa 1L',
    price: 12.50,
    image: '/images/suco-uva-integral-1l.jpg',
    category: 'Bebidas',
    description: 'Suco de uva 100% integral, sem adição de açúcar, saudável e saboroso, garrafa 1 litro.',
    countInStock: 40,
  },
  {
    id: '25', // Novo ID
    name: 'Água Mineral sem Gás Garrafa 1.5L',
    price: 2.50,
    image: '/images/agua-mineral-sem-gas-1_5l.jpg',
    category: 'Bebidas',
    description: 'Água mineral natural sem gás, leve e pura, garrafa PET 1.5 litros.',
    countInStock: 250,
  },
  {
    id: '26', // Novo ID
    name: 'Cerveja Pilsen Lata 350ml (Pack com 6)',
    price: 21.00,
    image: '/images/cerveja-pilsen-lata-pack6.jpg',
    category: 'Bebidas',
    description: 'Cerveja tipo Pilsen clara e refrescante, pack com 6 latas de 350ml.',
    countInStock: 80, // 80 packs
  },

  // Congelados
  {
    id: '13',
    name: 'Pizza Congelada Mussarela 460g',
    price: 18.90,
    image: '/images/pizza-congelada-mussarela-460g.jpg',
    category: 'Congelados',
    description: 'Pizza congelada sabor mussarela, prática e deliciosa, pronta em minutos, 460 gramas.',
    countInStock: 30,
  },
  {
    id: '14',
    name: 'Batata Palito Pré-frita Congelada Pacote 400g',
    price: 9.80,
    image: '/images/batata-palito-congelada-400g.jpg',
    category: 'Congelados',
    description: 'Batata palito pré-frita congelada, crocante e sequinha, pacote com 400 gramas.',
    countInStock: 55,
  },
  {
    id: '27', // Novo ID
    name: 'Hambúrguer Bovino Congelado Caixa 56g (12 unidades)',
    price: 25.00,
    image: '/images/hamburguer-bovino-congelado-cx12.jpg',
    category: 'Congelados',
    description: 'Hambúrguer de carne bovina congelado, ideal para lanches, caixa com 12 unidades de 56g cada.',
    countInStock: 40,
  },
  {
    id: '28', // Novo ID
    name: 'Pão de Queijo Congelado Pacote 400g',
    price: 11.50,
    image: '/images/pao-de-queijo-congelado-400g.jpg',
    category: 'Congelados',
    description: 'Pão de queijo tradicional congelado, fácil de assar, pacote com 400 gramas.',
    countInStock: 50,
  },

  // Carnes
  {
    id: '15',
    name: 'Patinho Bovino Moído Bandeja 500g',
    price: 22.00,
    image: '/images/patinho-bovino-moido-500g.jpg',
    category: 'Carnes',
    description: 'Carne bovina (patinho) moída fresca, ideal para diversas receitas, bandeja com 500 gramas.',
    countInStock: 25,
  },
  {
    id: '16',
    name: 'Filé de Peito de Frango Bandeja 1kg',
    price: 19.90,
    image: '/images/file-peito-frango-1kg.jpg',
    category: 'Carnes',
    description: 'Filé de peito de frango sem osso e sem pele, carne magra e saudável, bandeja com 1kg.',
    countInStock: 30,
  },
  {
    id: '29', // Novo ID
    name: 'Linguiça Toscana Frescal Pacote 500g',
    price: 14.50,
    image: '/images/linguica-toscana-frescal-500g.jpg',
    category: 'Carnes',
    description: 'Linguiça toscana frescal de porco, temperada e suculenta, pacote com 500 gramas.',
    countInStock: 35,
  },
  {
    id: '30', // Novo ID
    name: 'Bisteca Suína Resfriada (kg)',
    price: 17.80,
    image: '/images/bisteca-suina-kg.jpg',
    category: 'Carnes',
    description: 'Bisteca suína fresca e resfriada, cortes selecionados, vendida por quilo.',
    countInStock: 20, // 20kg
  },
];

// Lista de categorias para os filtros (mantendo "Todos" como primeira opção)
export const categories = [
  'Todos',
  'Laticínios',
  'Limpeza',
  'Padaria',
  'Hortifruti',
  'Bebidas',
  'Congelados',
  'Carnes',
];

export default products;