export const getInitialData = (dbPath:string):any[] => {
  //you can return custom initial data depending on the database being created
  //console.log('************************ dbPath: ', dbPath)
  if(dbPath == '../../data/databases/db') return [{
    key: 'notes', value: JSON.stringify([
      { id: 1, title: "note 1", description: "UGEARS Maqueta de Coche para Montar - Puzzle 3D y Maqueta para Montar Coche Retro - Maquetas de Coches para Construir con Techo Plegable y Motor de 4 Cilindros - Maquetas para Construir para Adultos" },
      { id: 15, title: "note 2", description: "Jata HVIN2212 - Sacacorchos de Palanca, Abridor de vino con doble impulso articulado, Incluye navaja cortacápsulas y abridor de tapones, De acero inoxidable, ABS" },
      { id: 2, title: "note 1", description: "Toskope Cortador de Vegetales 15 en 1, Mandolina Verduras con 7 Cuchillas Iintercambiables, Corta Verduras Mandolina Adecuado para Cortar Verduras en la Cocina" },
      { id: 3, title: "note 1", description: "UGEARS Maqueta de Coche para Montar - Puzzle 3D y Maqueta para Montar Coche Retro - Maquetas de Coches para Construir con Techo Plegable y Motor de 4 Cilindros - Maquetas para Construir para Adultos" },
      { id: 4, title: "note 2", description: "Jata HVIN2212 - Sacacorchos de Palanca, Abridor de vino con doble impulso articulado, Incluye navaja cortacápsulas y abridor de tapones, De acero inoxidable, ABS" },
      { id: 5, title: "note 1", description: "Toskope Cortador de Vegetales 15 en 1, Mandolina Verduras con 7 Cuchillas Iintercambiables, Corta Verduras Mandolina Adecuado para Cortar Verduras en la Cocina" },
      { id: 6, title: "note 1", description: "UGEARS Maqueta de Coche para Montar - Puzzle 3D y Maqueta para Montar Coche Retro - Maquetas de Coches para Construir con Techo Plegable y Motor de 4 Cilindros - Maquetas para Construir para Adultos" },
      { id: 7, title: "note 2", description: "Jata HVIN2212 - Sacacorchos de Palanca, Abridor de vino con doble impulso articulado, Incluye navaja cortacápsulas y abridor de tapones, De acero inoxidable, ABS" },
      { id: 8, title: "note 1", description: "Toskope Cortador de Vegetales 15 en 1, Mandolina Verduras con 7 Cuchillas Iintercambiables, Corta Verduras Mandolina Adecuado para Cortar Verduras en la Cocina" },
      { id: 9, title: "note 1", description: "UGEARS Maqueta de Coche para Montar - Puzzle 3D y Maqueta para Montar Coche Retro - Maquetas de Coches para Construir con Techo Plegable y Motor de 4 Cilindros - Maquetas para Construir para Adultos" },
      { id: 10, title: "note 2", description: "Jata HVIN2212 - Sacacorchos de Palanca, Abridor de vino con doble impulso articulado, Incluye navaja cortacápsulas y abridor de tapones, De acero inoxidable, ABS" },
      { id: 11, title: "note 1", description: "Toskope Cortador de Vegetales 15 en 1, Mandolina Verduras con 7 Cuchillas Iintercambiables, Corta Verduras Mandolina Adecuado para Cortar Verduras en la Cocina" },
      { id: 12, title: "note 1", description: "UGEARS Maqueta de Coche para Montar - Puzzle 3D y Maqueta para Montar Coche Retro - Maquetas de Coches para Construir con Techo Plegable y Motor de 4 Cilindros - Maquetas para Construir para Adultos" },
      { id: 13, title: "note 2", description: "Jata HVIN2212 - Sacacorchos de Palanca, Abridor de vino con doble impulso articulado, Incluye navaja cortacápsulas y abridor de tapones, De acero inoxidable, ABS" },
      { id: 14, title: "note 1", description: "Toskope Cortador de Vegetales 15 en 1, Mandolina Verduras con 7 Cuchillas Iintercambiables, Corta Verduras Mandolina Adecuado para Cortar Verduras en la Cocina" }
    ])
  }]
  if(dbPath == '../../data/databases/notes') return [
    {
      key: '0',
      value: JSON.stringify({id: 0, title: "test title1", body: "test body1"}),
    },
    {
      key: '1',
      value: JSON.stringify({id: 1, title: "test title2", body: "test body2"}),
    },    {
      key: '2',
      value: JSON.stringify({id: 2, title: "test title3", body: "test body3"}),
    }
  ]
  if(dbPath == '../../data/databases/auth') return []
  return []
}