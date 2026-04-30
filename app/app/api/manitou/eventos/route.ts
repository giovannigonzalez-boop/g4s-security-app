// Cambia esta parte en tu route.ts de eventos
    const activityRes = await fetch(`${url}/api/Customer/Activity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
         Top: 50,              // Pedimos 50 en lugar de 10 para asegurar que traiga algo
         IncludeAudits: true,  // Incluimos auditorías (aperturas/cierres) por si no hay alarmas
         // Si tienes un CustomerId de prueba, podrías ponerlo aquí, 
         // pero dejarlo vacío suele traer la actividad general permitida al usuario.
      })
    });
