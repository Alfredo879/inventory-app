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
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
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
      setEditItem(data); // Inicializar el formulario de edición con los datos del item
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem(prev => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditItem(item); // Volver a los datos originales
  };

  const handleUpdateItem = async () => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editItem),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setItem(updatedData);
        setEditItem(updatedData);
        setIsEditing(false);
        setMessage('Item actualizado exitosamente!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(`Error al actualizar: ${errorData.message || 'Ocurrió un error'}`);
      }
    } catch (error) {
      setMessage('Error de red al actualizar el item.');
    }
  };

  const handleDeleteItem = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este item?')) {
      try {
        const response = await fetch(`/api/items/${id}`, {
          method: 'DELETE',
        });

        if (response.status === 204) {
          router.push('/'); // Redirigir al inventario después de eliminar
        } else {
          setMessage('Error al eliminar el item.');
        }
      } catch (error) {
        setMessage('Error de red al eliminar el item.');
      }
    }
  };

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
    return null;
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

          {message && (
            <div className="bg-green-200 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Éxito!</strong>
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <div className="bg-white shadow-md rounded-md p-6">
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label htmlFor="edit-name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
                  <input type="text" id="edit-name" name="name" value={editItem.name} onChange={handleEditChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="edit-description" className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                  <textarea id="edit-description" name="description" value={editItem.description} onChange={handleEditChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="edit-quantity" className="block text-gray-700 text-sm font-bold mb-2">Cantidad:</label>
                  <input type="number" id="edit-quantity" name="quantity" value={editItem.quantity} onChange={handleEditChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" min="1" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="edit-price" className="block text-gray-700 text-sm font-bold mb-2">Precio:</label>
                  <input type="number" id="edit-price" name="price" value={editItem.price} onChange={handleEditChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" min="0" step="0.01" />
                </div>
                <button onClick={handleUpdateItem} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">Guardar</button>
                <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-2"><span className="font-semibold">Descripción:</span> {item.description || 'No description available'}</p>
                <p className="text-gray-700 mb-2"><span className="font-semibold">Cantidad:</span> {item.quantity}</p>
                {item.price !== undefined && (
                  <p className="text-gray-700 mb-2"><span className="font-semibold">Precio:</span> ${item.price}</p>
                )}
                <p className="text-gray-700 mb-4"><span className="font-semibold">ID:</span> {item.id}</p>
                <button onClick={handleStartEdit} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">Editar</button>
                <button onClick={handleDeleteItem} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Eliminar</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}