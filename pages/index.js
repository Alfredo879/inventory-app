import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInventoryItems(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">Error al cargar el inventario: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Inventario</title>
        <meta name="description" content="Lista de items del inventario" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 min-h-screen py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Inventario de Productos</h1>

          <Link href="/items/add" className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
            Agregar Nuevo Item
          </Link>

          {inventoryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryItems.map(item => (
                <div key={item.id} className="bg-white shadow-md rounded-md p-4">
                  <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
                  <p className="text-gray-700 mb-1">{item.description}</p>
                  <p className="text-gray-700 mb-1">Cantidad: {item.quantity}</p>
                  {item.price !== undefined && <p className="text-gray-700 mb-2">Precio: ${item.price}</p>}
                  <Link href={`/items/${item.id}`} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
                    Ver Detalles
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay items en el inventario.</p>
          )}
        </div>
      </main>
    </div>
  );
}