
# Quote API

API para la generación de cotizaciones en PDF y Excel utilizando Node.js, Express y Sequelize.

## 🚀 **Instalación**

1. Clona el repositorio o descarga el archivo ZIP.
2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con el siguiente formato:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=nombre_bd
PORT=4000
```

4. Ejecuta el proyecto:

```bash
npm run dev
```

---

## 📂 **Estructura del Proyecto**
```
src/
├── config/                  # Configuración de Sequelize y PostgreSQL
├── controllers/             # Lógica de negocio
├── models/                  # Modelos de Sequelize
├── routes/                  # Rutas de Express
└── server.js                # Configuración de servidor
```

---

## 🛠️ **Endpoints**

### ✅ **Clientes**
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/clients` | Crear un nuevo cliente |
| `GET`  | `/api/clients` | Obtener todos los clientes |
| `GET`  | `/api/clients/:clientId` | Obtener un cliente por ID |
| `PUT`  | `/api/clients/:clientId` | Actualizar un cliente |
| `DELETE` | `/api/clients/:clientId` | Eliminar un cliente |

#### Ejemplo:
```bash
# Crear un cliente
curl -X POST http://localhost:4000/api/clients -H "Content-Type: application/json" -d '{
  "name": "Cliente S.A.",
  "email": "cliente@example.com",
  "phone": "+123456789"
}'
```

```bash
# Obtener todos los clientes
curl -X GET http://localhost:4000/api/clients
```

```bash
# Obtener cliente por ID
curl -X GET http://localhost:4000/api/clients/1
```

```bash
# Actualizar cliente
curl -X PUT http://localhost:4000/api/clients/1 -H "Content-Type: application/json" -d '{
  "name": "Cliente Actualizado"
}'
```

```bash
# Eliminar cliente
curl -X DELETE http://localhost:4000/api/clients/1
```

---

### ✅ **Productos**
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/products` | Crear un nuevo producto |
| `GET`  | `/api/products` | Obtener todos los productos |
| `GET`  | `/api/products/:productId` | Obtener un producto por ID |
| `PUT`  | `/api/products/:productId` | Actualizar un producto |
| `DELETE` | `/api/products/:productId` | Eliminar un producto |
| `PATCH` | `/api/products/:productId/select` | Marcar un producto como seleccionado |

#### Ejemplo:
```bash
# Crear un producto
curl -X POST http://localhost:4000/api/products -H "Content-Type: application/json" -d '{
  "category": "Software",
  "part_number": "SOS-001",
  "compatibility": "ALL",
  "description": "Licencia de prueba",
  "msrp_usd": 99.99,
  "is_selected": false
}'
```

```bash
# Obtener todos los productos
curl -X GET http://localhost:4000/api/products
```

```bash
# Obtener producto por ID
curl -X GET http://localhost:4000/api/products/1
```

```bash
# Actualizar producto
curl -X PUT http://localhost:4000/api/products/1 -H "Content-Type: application/json" -d '{
  "msrp_usd": 150.00
}'
```

```bash
# Marcar producto como seleccionado
curl -X PATCH http://localhost:4000/api/products/1/select
```

```bash
# Eliminar producto
curl -X DELETE http://localhost:4000/api/products/1
```

---

### ✅ **Cotizaciones**
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/quotes` | Crear una nueva cotización |
| `GET`  | `/api/quotes` | Obtener todas las cotizaciones |
| `GET`  | `/api/quotes/:quoteId` | Obtener una cotización por ID |
| `PUT`  | `/api/quotes/:quoteId` | Actualizar una cotización |
| `DELETE` | `/api/quotes/:quoteId` | Eliminar una cotización |
| `GET`  | `/api/quotes/client/:clientId` | Obtener cotizaciones por cliente |
| `GET`  | `/api/quotes/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Obtener cotizaciones por rango de fechas |
| `GET`  | `/api/quotes/:quoteId/pdf` | Exportar cotización a PDF |
| `GET`  | `/api/quotes/:quoteId/excel` | Exportar cotización a Excel |

#### Ejemplo:
```bash
# Crear una cotización
curl -X POST http://localhost:4000/api/quotes -H "Content-Type: application/json" -d '{
  "clientId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "discountPercent": 10
    }
  ],
  "generalDiscountPercent": 5
}'
```

```bash
# Obtener todas las cotizaciones
curl -X GET http://localhost:4000/api/quotes
```

```bash
# Obtener cotización por ID
curl -X GET http://localhost:4000/api/quotes/1
```

```bash
# Obtener cotizaciones por cliente
curl -X GET http://localhost:4000/api/quotes/client/1
```

```bash
# Obtener cotizaciones por rango de fechas
curl -X GET "http://localhost:4000/api/quotes/date-range?startDate=2025-03-01&endDate=2025-03-31"
```

```bash
# Exportar cotización a PDF
curl -X GET http://localhost:4000/api/quotes/1/pdf --output quote-1.pdf
```

```bash
# Exportar cotización a Excel
curl -X GET http://localhost:4000/api/quotes/1/excel --output quote-1.xlsx
```

```bash
# Eliminar cotización
curl -X DELETE http://localhost:4000/api/quotes/1
```

---

## ✅ **Dependencias**
```bash
npm install express sequelize pg pg-hstore cors dotenv pdfkit exceljs
```

---

## 👨‍💻 **Autor**
**Desarrollado por**: [Cristian Gomez](https://crishhio.com)  

---

## 🏆 **Licencia**
Este proyecto está bajo la licencia **MIT**.
