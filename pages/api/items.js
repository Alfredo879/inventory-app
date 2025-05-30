// Simulación de una base de datos en memoria
let inventory = [
  { id: '1', name: 'Laptop', description: 'Laptop de alto rendimiento', quantity: 10, price: 1200 },
  { id: '2', name: 'Mouse', description: 'Mouse inalámbrico ergonómico', quantity: 50, price: 25 },
  { id: '3', name: 'Teclado', description: 'Teclado mecánico retroiluminado', quantity: 30, price: 75 },
  { id: '4', name: 'Monitor', description: 'Monitor 27 pulgadas 4K', quantity: 15, price: 350 },
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener la lista de todos los items
    res.status(200).json(inventory);
  } else if (req.method === 'POST') {
    // Agregar un nuevo item
    const { name, description, quantity, price } = req.body;
    if (!name || quantity === undefined) {
      return res.status(400).json({ message: 'Nombre y cantidad son requeridos' });
    }

    const newItem = {
      id: Date.now().toString(), // Simulación de ID único
      name,
      description: description || '',
      quantity: parseInt(quantity),
      price: parseFloat(price) || 0,
    };

    inventory.push(newItem);
    res.status(201).json(newItem); // Respondemos con el item creado
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}