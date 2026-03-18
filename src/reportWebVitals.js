
// Esta función permite medir métricas de rendimiento en la app React.
// Recibe una función (onPerfEntry) que se ejecuta con los resultados de las métricas.
const reportWebVitals = onPerfEntry => {
  // Verifica que se haya pasado una función válida como parámetro.
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Importa dinámicamente el paquete 'web-vitals' para obtener métricas clave.
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Ejecuta la función recibida con cada métrica de rendimiento:
      // getCLS: Cumulative Layout Shift
      // getFID: First Input Delay
      // getFCP: First Contentful Paint
      // getLCP: Largest Contentful Paint
      // getTTFB: Time to First Byte
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Exporta la función para que pueda usarse en otros archivos.
export default reportWebVitals;
