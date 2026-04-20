import express from 'express'
import cors from 'cors'
import categoryRoutes from './routes/categories'
import authRoutes from './routes/auth'
import productRoutes from './routes/products'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/v1/auth', authRoutes)
app.use('/v1/categories', categoryRoutes)
app.use('/v1/products', productRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
