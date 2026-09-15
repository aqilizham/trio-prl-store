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

const asset = (file: string) => `${import.meta.env.BASE_URL}images/${file}`
export const brandLogo = asset('trioprl-logo-crop.png')

export const products: Product[] = [
  { id: 'oxford-01', name: 'The Classic Oxford', price: 189, category: 'shirts', tone: 'Navy · brushed cotton', image: asset('trio-fleece-source.jpg'), label: 'Signature edit', description: 'A classic button-down with a neat collar, substantial cotton and an easy everyday fit.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'mesh-01', name: 'Riviera Polo', price: 159, category: 'tees', tone: 'Deep navy · piqué cotton', image: asset('trio-knitwear-source.jpg'), label: 'New in', description: 'A crisp polo silhouette with understated contrast detailing and a clean, relaxed drape.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'halfzip-01', name: 'Harbour Half-Zip', price: 229, category: 'knitwear', tone: 'Heather grey · cotton fleece', image: asset('trio-knit-source.jpg'), label: 'Limited run', description: 'A weighty quarter-zip for cool mornings, long drives and slow weekends.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'tee-01', name: 'Heavyweight Pocket Tee', price: 99, category: 'tees', tone: 'Black · 240gsm cotton', image: asset('trio-knitwear-source.jpg'), imagePosition: '50% 48%', description: 'The dependable tee, cut from substantial cotton and finished with a neat chest pocket.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'overshirt-01', name: 'Field Overshirt', price: 249, category: 'outerwear', tone: 'Black · cotton twill', image: asset('trio-knitwear-source.jpg'), label: 'Best seller', description: 'A light overshirt with a crisp collar, roomy cut and a shape that layers beautifully.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 'crew-01', name: 'Sunday Crew', price: 179, category: 'knitwear', tone: 'Heather grey · cotton fleece', image: asset('trio-knit-source.jpg'), imagePosition: '50% 53%', description: 'Soft cotton fleece, a clean collar and the kind of comfort that still looks pulled together.', sizes: ['S', 'M', 'L', 'XL'] },
]

export const formatPrice = (value: number) => new Intl.NumberFormat('en-MY', {
  style: 'currency', currency: 'MYR', maximumFractionDigits: 0,
}).format(value)
