const fetchData = async () => {
  setLoading(true);
  try {
    // 1. Llamamos a nuestro nuevo túnel de eventos
    const response = await fetch('/api/manitou/eventos');
    const result = await response.json();
    
    if (result.success && result.data) {
      // 2. Mapeamos los datos de Manitou al formato de tu interfaz
      // Ajustamos los nombres de los campos según la respuesta real de Bold
      const mappedLogs = result.data.map((item: any) => ({
        id: item.Id || Math.random(),
        nombre_cliente: item.CustomerName || "Cliente Manitou",
        cuenta: item.CustomerId || "N/A",
        tipo_evento: item.EventDescription || "Evento de Seguridad",
        fecha_evento: new Date(item.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // Si Manitou no trae coordenadas, usamos las de Barranquilla por defecto
        latitud: item.Latitude || 10.9685,
        longitud: item.Longitude || -74.7813
      }));

      setLogs(mappedLogs);

      // 3. Actualizamos el mapa con la ubicación del evento más reciente
      if (mappedLogs.length > 0) {
        setCoords({ lat: mappedLogs[0].latitud, lng: mappedLogs[0].longitud });
      }
    }
  } catch (err) {
    console.error("Error conectando con el túnel de Manitou:", err);
  }
  setLoading(false);
};
