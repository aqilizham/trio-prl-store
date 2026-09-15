export type Product = {
  id: string
  name: string
  price: number
  category: string
  tone: string
  image: string
  imagePosition?: string
  label?: string
  description: string
  sizes: string[]
}

export const categories = [
  { id: 'all', label: 'All pieces' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'knitwear', label: 'Knitwear' },
  { id: 'tees', label: 'Tees & polos' },
  { id: 'outerwear', label: 'Outerwear' },
]

export const products: Product[] = [
  {
    id: 'oxford-01', name: 'The Everyday Oxford', price: 189, category: 'shirts',
    tone: 'Ivory · brushed cotton', image: '/images/common-thread-hero.png', imagePosition: '72% center', label: 'Studio favourite',
    description: 'A relaxed oxford with a soft collar, generous cut and just enough structure for every day.', sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'mesh-01', name: 'Riviera Mesh Polo', price: 159, category: 'tees', tone: 'Ecru · breathable mesh', image: '/images/common-thread-polo.png', label: 'New in',
    description: 'A breathable knit polo with an easy drape and a quiet, considered finish.', sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'halfzip-01', name: 'Harbour Half-Zip', price: 229, category: 'knitwear', tone: 'Ink navy · ribbed knit', image: '/images/common-thread-knit.png', label: 'Limited run',
    description: 'A weighty ribbed half-zip for cool mornings, long drives and slow weekends.', sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'tee-01', name: 'Heavyweight Pocket Tee', price: 99, category: 'tees', tone: 'Chalk · 240gsm cotton', image: '/images/common-thread-hero.png', imagePosition: '47% 58%',
    description: 'The dependable tee, cut from substantial cotton and finished with a neat chest pocket.', sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'overshirt-01', name: 'Field Overshirt', price: 249, category: 'outerwear', tone: 'Olive · canvas cotton', image: '/images/common-thread-polo.png', imagePosition: '52% 51%', label: 'Best seller',
    description: 'A light canvas overshirt with roomy pockets and a shape that layers beautifully.', sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'crew-01', name: 'Sunday Crew', price: 179, category: 'knitwear', tone: 'Oat · cotton fleece', image: '/images/common-thread-knit.png', imagePosition: '38% 54%',
    description: 'Soft cotton fleece, a clean crew neck and the kind of comfort that still looks pulled together.', sizes: ['S', 'M', 'L', 'XL'],
  },
]

export const formatPrice = (value: number) => new Intl.NumberFormat('en-MY', {
  style: 'currency', currency: 'MYR', maximumFractionDigits: 0,
}).format(value)
