const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manitou/eventos');
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        const mappedLogs = result.data.map((item: any) => ({
          id: item.Id || item.EventID || Math.random(),
          nombre_cliente: item.CustomerName || item.Name || "Cliente Real",
          cuenta: item.CustomerId || "0000",
          tipo_evento: item.EventDescription || "Evento Detectado",
          fecha_evento: new Date().toLocaleTimeString(),
          latitud: 10.9685,
          longitud: -74.7813
        }));
        setLogs(mappedLogs);
      }
    } catch (err) {
      console.error("Error conectando con Manitou:", err);
    }
    setLoading(false);
  };
