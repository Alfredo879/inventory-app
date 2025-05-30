import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ItemDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const response = await fetch(`/api/items/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
              setError('Item no encontrado');
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            setLoading(false);
            return;
          }
          const data = await response.json();
          setItem(data);
          setLoading(false);
        } catch (e) {
          setError(e.message);
          setLoading(false);
        }
      };

      fetchItem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>Cargando detalles del item...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">{error}</p>
        <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Volver al Inventario
        </Link>
      </div>
    );
  }

  if (!item) {
    return null; // No mostrar nada si no se está cargando y no hay error pero tampoco item
  }

  return (
    <div>
      <Head>
        <title>{item.name} - Detalles</title>
        <meta name="description" content={`Detalles del item: ${item.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 min-h-screen py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">{item.name}</h1>

          <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Volver al Inventario
          </Link>

          <div className="bg-white shadow-md rounded-md p-6">
            <p className="text-gray-700 mb-2"><span className="font-semibold">Descripción:</span> {item.description || 'No description available'}</p>
            <p className="text-gray-700 mb-2"><span className="font-semibold">Cantidad:</span> {item.quantity}</p>
            {item.price !== undefined && (
              <p className="text-gray-700 mb-2"><span className="font-semibold">Precio:</span> ${item.price}</p>
            )}
            <p className="text-gray-700"><span className="font-semibold">ID:</span> {item.id}</p>

            {/* Aquí podríamos agregar botones para editar o eliminar en el futuro */}
          </div>
        </div>
      </main>
    </div>
  );
}