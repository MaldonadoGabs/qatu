import type { Categoria } from '../services/productosService.js';

export interface ProductoPredeterminado {
    nombre: string;
    precio: number;
    categoria: Categoria;
    descripcion: string;
    imagen: string;
    vendedor: string;
}

export const productosPredeterminados: ProductoPredeterminado[] = [
    // 📱 Electrónicos (2)
    {
        nombre: "Laptop Gaming Pro 15",
        precio: 1299.99,
        categoria: "electronicos",
        descripcion: "Laptop gaming con procesador Intel i7, 16GB RAM, RTX 4060, SSD 512GB. Perfecta para juegos AAA y diseño.",
        imagen: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
        vendedor: "TechStore Perú"
    },
    {
        nombre: "Audífonos Bluetooth Premium",
        precio: 89.99,
        categoria: "electronicos",
        descripcion: "Auriculares inalámbricos con cancelación de ruido activa. Batería de 30 horas. Sonido Hi-Fi.",
        imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        vendedor: "AudioMax"
    },

    {
        nombre: "Smartphone 5G 128GB",
        precio: 599.00,
        categoria: "electronicos",
        descripcion: "Pantalla AMOLED 6.5”, cámara 64MP y batería 5000mAh.",
        imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        vendedor: "MobileZone"
    },
    {
        nombre: "Tablet 10” Educativa",
        precio: 249.99,
        categoria: "electronicos",
        descripcion: "Ideal para estudio y streaming. Incluye funda.",
        imagen: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
        vendedor: "EduTech"
    },
    {
        nombre: "Smartwatch Deportivo",
        precio: 159.90,
        categoria: "electronicos",
        descripcion: "Monitoreo de ritmo cardíaco, GPS y resistencia al agua.",
        imagen: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400",
        vendedor: "FitTech"
    },
    {
        nombre: "Teclado Mecánico RGB",
        precio: 109.00,
        categoria: "electronicos",
        descripcion: "Switches azules y retroiluminación personalizable.",
        imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
        vendedor: "GameHub"
    },
    {
        nombre: "Mouse Gamer 16000 DPI",
        precio: 59.99,
        categoria: "electronicos",
        descripcion: "Sensor óptico de alta precisión y diseño ergonómico.",
        imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
        vendedor: "GameHub"
    },
    {
        nombre: "Monitor 27” QHD",
        precio: 329.00,
        categoria: "electronicos",
        descripcion: "Resolución 2K y 144Hz para gaming y diseño.",
        imagen: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
        vendedor: "Display Pro"
    },
    {
        nombre: "Cámara Web Full HD",
        precio: 79.00,
        categoria: "electronicos",
        descripcion: "Ideal para clases virtuales y streaming.",
        imagen: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
        vendedor: "StreamTech"
    },
    {
        nombre: "Parlante Bluetooth Portátil",
        precio: 69.90,
        categoria: "electronicos",
        descripcion: "Sonido potente, resistente al agua IPX7.",
        imagen: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=400",
        vendedor: "SoundBox"
    },

    // 🏠 Hogar (2)
    {
        nombre: "Almohada Memory Foam Cervical",
        precio: 45.00,
        categoria: "hogar",
        descripcion: "Almohada ergonómica de espuma viscoelástica. Diseño cervical para mejor descanso. Funda lavable.",
        imagen: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
        vendedor: "Hogar Confort"
    },
    {
        nombre: "Juego de Sartenes Antiadherentes",
        precio: 79.90,
        categoria: "hogar",
        descripcion: "Set de 3 sartenes con recubrimiento cerámico. Libres de PFOA. Aptas para inducción.",
        imagen: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400",
        vendedor: "Cocina Total"
    },

    {
        nombre: "Licuadora de Alta Potencia",
        precio: 99.00,
        categoria: "hogar",
        descripcion: "Motor 800W, vaso de vidrio.",
        imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31b?w=400",
        vendedor: "HomeTech"
    },
    {
        nombre: "Cafetera Eléctrica",
        precio: 69.99,
        categoria: "hogar",
        descripcion: "Capacidad 12 tazas con filtro reutilizable.",
        imagen: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
        vendedor: "Coffee Home"
    },
    {
        nombre: "Ventilador de Torre",
        precio: 89.00,
        categoria: "hogar",
        descripcion: "3 velocidades y control remoto.",
        imagen: "https://images.unsplash.com/photo-1598300053654-28c4fcdc7e6a?w=400",
        vendedor: "Clima Hogar"
    },
    {
        nombre: "Aspiradora Compacta",
        precio: 119.00,
        categoria: "hogar",
        descripcion: "Potente y silenciosa, ideal para departamentos.",
        imagen: "https://images.unsplash.com/photo-1581579185169-6ca1c6c6f9b4?w=400",
        vendedor: "CleanPro"
    },
    {
        nombre: "Set de Toallas Premium",
        precio: 49.90,
        categoria: "hogar",
        descripcion: "Algodón 100%, alta absorción.",
        imagen: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=400",
        vendedor: "SoftHome"
    },
    {
        nombre: "Organizador Multiuso",
        precio: 24.00,
        categoria: "hogar",
        descripcion: "Ideal para cocina o baño.",
        imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        vendedor: "OrdenaYa"
    },
    {
        nombre: "Lámpara LED de Escritorio",
        precio: 34.90,
        categoria: "hogar",
        descripcion: "Luz regulable y bajo consumo.",
        imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
        vendedor: "BrightLife"
    },
    {
        nombre: "Difusor de Aromas",
        precio: 29.99,
        categoria: "hogar",
        descripcion: "Aromaterapia con aceites esenciales.",
        imagen: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=400",
        vendedor: "Zen Home"
    },

    // 👕 Ropa (2)
    {
        nombre: "Polo Oversize Algodón Premium",
        precio: 29.90,
        categoria: "ropa",
        descripcion: "Polo oversize 100% algodón pima. Corte holgado moderno. Disponible en varios colores.",
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        vendedor: "Urban Style"
    },
    {
        nombre: "Zapatillas Deportivas Running",
        precio: 119.00,
        categoria: "ropa",
        descripcion: "Zapatillas running con amortiguación de gel. Suela antideslizante. Ideales para maratón.",
        imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        vendedor: "SportZone"
    },

    {
        nombre: "Chaqueta Impermeable",
        precio: 89.90,
        categoria: "ropa",
        descripcion: "Protección contra lluvia y viento.",
        imagen: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400",
        vendedor: "Outdoor Pro"
    },
    {
        nombre: "Jeans Slim Fit",
        precio: 49.99,
        categoria: "ropa",
        descripcion: "Denim elástico de alta calidad.",
        imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        vendedor: "Denim Club"
    },
    {
        nombre: "Sudadera con Capucha",
        precio: 59.90,
        categoria: "ropa",
        descripcion: "Interior afelpado.",
        imagen: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400",
        vendedor: "Urban Style"
    },
    {
        nombre: "Vestido Casual",
        precio: 54.00,
        categoria: "ropa",
        descripcion: "Tela fresca y diseño moderno.",
        imagen: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        vendedor: "Moda Viva"
    },
    {
        nombre: "Camisa Formal",
        precio: 45.00,
        categoria: "ropa",
        descripcion: "Ideal para oficina.",
        imagen: "https://images.unsplash.com/photo-1593032465171-8f5f0f0e4a25?w=400",
        vendedor: "Classic Wear"
    },
    {
        nombre: "Short Deportivo",
        precio: 25.00,
        categoria: "ropa",
        descripcion: "Ligero y transpirable.",
        imagen: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
        vendedor: "SportZone"
    },
    {
        nombre: "Medias Deportivas Pack x3",
        precio: 14.90,
        categoria: "ropa",
        descripcion: "Cómodas y resistentes.",
        imagen: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
        vendedor: "ActiveWear"
    },
    {
        nombre: "Gorra Urbana",
        precio: 19.99,
        categoria: "ropa",
        descripcion: "Ajustable y moderna.",
        imagen: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400",
        vendedor: "Street Cap"
    },


    // 💄 Belleza (2)
    {
        nombre: "Crema Facial Anti-Edad con Retinol",
        precio: 54.90,
        categoria: "belleza",
        descripcion: "Crema facial con retinol y ácido hialurónico. Reduce arrugas y líneas de expresión. 50ml.",
        imagen: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
        vendedor: "Beauty Lab"
    },
    {
        nombre: "Shampoo Orgánico Aceite de Argán",
        precio: 32.00,
        categoria: "belleza",
        descripcion: "Shampoo 100% natural con aceite de argán. Sin sulfatos ni parabenos. Cabello suave y brillante.",
        imagen: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400",
        vendedor: "Natural Hair"
    },

    {
        nombre: "Sérum Vitamina C 15%",
        precio: 42.90,
        categoria: "belleza",
        descripcion: "Ilumina la piel y reduce manchas. Textura ligera.",
        imagen: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400",
        vendedor: "SkinCare Pro"
    },
    {
        nombre: "Protector Solar FPS 50+",
        precio: 36.00,
        categoria: "belleza",
        descripcion: "Protección UVA/UVB, resistente al agua.",
        imagen: "https://images.unsplash.com/photo-1556228578-3c1aab1e3b57?w=400",
        vendedor: "SunLab"
    },
    {
        nombre: "Agua Micelar Desmaquillante",
        precio: 24.50,
        categoria: "belleza",
        descripcion: "Limpia y desmaquilla sin irritar.",
        imagen: "https://images.unsplash.com/photo-1598662972299-5408ddb8a3dc?w=400",
        vendedor: "Dermal Care"
    },
    {
        nombre: "Mascarilla Facial Hidratante",
        precio: 19.90,
        categoria: "belleza",
        descripcion: "Hidratación profunda con aloe vera.",
        imagen: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400",
        vendedor: "Beauty Lab"
    },
    {
        nombre: "Base Líquida Natural",
        precio: 39.90,
        categoria: "belleza",
        descripcion: "Cobertura media y acabado mate.",
        imagen: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        vendedor: "Makeup Studio"
    },
    {
        nombre: "Labial Mate Larga Duración",
        precio: 18.00,
        categoria: "belleza",
        descripcion: "Color intenso hasta 12 horas.",
        imagen: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
        vendedor: "Makeup Studio"
    },
    {
        nombre: "Crema Corporal Nutritiva",
        precio: 27.90,
        categoria: "belleza",
        descripcion: "Manteca de karité y vitamina E.",
        imagen: "https://images.unsplash.com/photo-1600185365483-26d7b8c2b8c0?w=400",
        vendedor: "Soft Skin"
    },
    {
        nombre: "Aceite Facial Rosa Mosqueta",
        precio: 34.00,
        categoria: "belleza",
        descripcion: "Regenera y mejora la elasticidad.",
        imagen: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400",
        vendedor: "Natural Glow"
    },


    // 🏋️ Deportes (2)
    {
        nombre: "Mancuernas Ajustables 20kg Set",
        precio: 149.00,
        categoria: "deportes",
        descripcion: "Par de mancuernas con peso ajustable de 5 a 20kg. Agarre ergonómico antideslizante.",
        imagen: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
        vendedor: "FitGear Pro"
    },
    {
        nombre: "Colchoneta Yoga Premium NBR",
        precio: 39.90,
        categoria: "deportes",
        descripcion: "Colchoneta de yoga 10mm de grosor. Material NBR eco-friendly. Incluye correa de transporte.",
        imagen: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
        vendedor: "Zen Fitness"
    },

    {
        nombre: "Bicicleta Estática Fitness",
        precio: 399.00,
        categoria: "deportes",
        descripcion: "Entrenamiento cardiovascular en casa.",
        imagen: "https://images.unsplash.com/photo-1518611012118-f0c5c6c7c4c3?w=400",
        vendedor: "FitGear Pro"
    },
    {
        nombre: "Cuerda para Saltar Profesional",
        precio: 19.90,
        categoria: "deportes",
        descripcion: "Ideal para cardio y resistencia.",
        imagen: "https://images.unsplash.com/photo-1599058917212-d750089bc07d?w=400",
        vendedor: "FitLife"
    },
    {
        nombre: "Guantes de Entrenamiento",
        precio: 24.00,
        categoria: "deportes",
        descripcion: "Protección y agarre antideslizante.",
        imagen: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
        vendedor: "SportZone"
    },
    {
        nombre: "Bandas Elásticas Set x5",
        precio: 29.90,
        categoria: "deportes",
        descripcion: "Diferentes niveles de resistencia.",
        imagen: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400",
        vendedor: "Zen Fitness"
    },
    {
        nombre: "Balón de Fútbol Profesional",
        precio: 39.00,
        categoria: "deportes",
        descripcion: "Uso profesional y recreativo.",
        imagen: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
        vendedor: "SportZone"
    },
    {
        nombre: "Rodillera Deportiva",
        precio: 22.90,
        categoria: "deportes",
        descripcion: "Soporte y estabilidad.",
        imagen: "https://images.unsplash.com/photo-1599058917212-d750089bc07d?w=400",
        vendedor: "FitCare"
    },
    {
        nombre: "Banco Multifuncional",
        precio: 189.00,
        categoria: "deportes",
        descripcion: "Entrenamiento completo en casa.",
        imagen: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400",
        vendedor: "FitGear Pro"
    },
    {
        nombre: "Botella Deportiva Acero",
        precio: 17.50,
        categoria: "deportes",
        descripcion: "Mantiene bebidas frías y calientes.",
        imagen: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400",
        vendedor: "Active Life"
    },


    // 📚 Libros (2)
    {
        nombre: "Hábitos Atómicos - James Clear",
        precio: 24.90,
        categoria: "libros",
        descripcion: "Bestseller sobre cómo crear buenos hábitos y eliminar malos. Cambios pequeños, resultados extraordinarios.",
        imagen: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        vendedor: "Librería Cultural"
    },
    {
        nombre: "El Poder del Ahora - Eckhart Tolle",
        precio: 21.50,
        categoria: "libros",
        descripcion: "Guía práctica de iluminación espiritual. Aprende a vivir en el presente y encontrar paz interior.",
        imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        vendedor: "Librería Cultural"
    },

    {
        nombre: "Padre Rico, Padre Pobre",
        precio: 22.90,
        categoria: "libros",
        descripcion: "Educación financiera básica.",
        imagen: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        vendedor: "Librería Cultural"
    },
    {
        nombre: "Los 7 Hábitos de la Gente Altamente Efectiva",
        precio: 25.00,
        categoria: "libros",
        descripcion: "Desarrollo personal y liderazgo.",
        imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        vendedor: "Librería Central"
    },
    {
        nombre: "El Alquimista",
        precio: 19.90,
        categoria: "libros",
        descripcion: "Novela sobre sueños y propósito.",
        imagen: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
        vendedor: "Book World"
    },
    {
        nombre: "Cien Años de Soledad",
        precio: 26.50,
        categoria: "libros",
        descripcion: "Clásico de la literatura latinoamericana.",
        imagen: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        vendedor: "Book World"
    },
    {
        nombre: "Mindset",
        precio: 23.90,
        categoria: "libros",
        descripcion: "La actitud del éxito.",
        imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        vendedor: "Librería Central"
    },
    {
        nombre: "Cómo Hacer que te Pasen Cosas Buenas",
        precio: 21.00,
        categoria: "libros",
        descripcion: "Psicología práctica y bienestar.",
        imagen: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
        vendedor: "Lectura Viva"
    },
    {
        nombre: "Atomic Habits Workbook",
        precio: 18.90,
        categoria: "libros",
        descripcion: "Ejercicios prácticos de hábitos.",
        imagen: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        vendedor: "Librería Cultural"
    },
    {
        nombre: "Sapiens",
        precio: 29.00,
        categoria: "libros",
        descripcion: "Historia de la humanidad.",
        imagen: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        vendedor: "Historia Viva"
    },


    // 🧸 Juguetes (2)
    {
        nombre: "Rompecabezas 1000 Piezas Paisaje",
        precio: 28.00,
        categoria: "juguetes",
        descripcion: "Puzzle de 1000 piezas con hermoso paisaje natural. Desarrollo cognitivo y concentración.",
        imagen: "https://images.unsplash.com/photo-1611329532992-7dfb191a9a89?w=400",
        vendedor: "Toy Kingdom"
    },
    {
        nombre: "Muñeca Interactiva con Sonidos",
        precio: 65.00,
        categoria: "juguetes",
        descripcion: "Muñeca de 40cm con 50 frases y sonidos. Ojos que se abren y cierran. Ropa incluida.",
        imagen: "https://images.unsplash.com/photo-1587912781766-f8ba089b0a5a?w=400",
        vendedor: "Kids World"
    },

    {
        nombre: "Bloques de Construcción 500 piezas",
        precio: 49.90,
        categoria: "juguetes",
        descripcion: "Estimula creatividad y lógica.",
        imagen: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
        vendedor: "Toy Kingdom"
    },
    {
        nombre: "Carro a Control Remoto",
        precio: 59.00,
        categoria: "juguetes",
        descripcion: "Alta velocidad y recargable.",
        imagen: "https://images.unsplash.com/photo-1601758123927-196b89be8e9b?w=400",
        vendedor: "Kids World"
    },
    {
        nombre: "Pelota Saltarina",
        precio: 15.00,
        categoria: "juguetes",
        descripcion: "Diversión al aire libre.",
        imagen: "https://images.unsplash.com/photo-1601758123927-196b89be8e9b?w=400",
        vendedor: "PlayFun"
    },
    {
        nombre: "Set de Plastilina Creativa",
        precio: 18.90,
        categoria: "juguetes",
        descripcion: "Colores no tóxicos.",
        imagen: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
        vendedor: "Art Kids"
    },
    {
        nombre: "Juego de Mesa Familiar",
        precio: 34.00,
        categoria: "juguetes",
        descripcion: "Ideal para compartir en familia.",
        imagen: "https://images.unsplash.com/photo-1601758123927-196b89be8e9b?w=400",
        vendedor: "Fun Games"
    },
    {
        nombre: "Peluche Gigante",
        precio: 42.90,
        categoria: "juguetes",
        descripcion: "Suave y abrazable.",
        imagen: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
        vendedor: "Soft Toys"
    },
    {
        nombre: "Pista de Autos",
        precio: 65.00,
        categoria: "juguetes",
        descripcion: "Incluye 2 autos.",
        imagen: "https://images.unsplash.com/photo-1601758123927-196b89be8e9b?w=400",
        vendedor: "Toy Kingdom"
    },
    {
        nombre: "Muñeco Articulado",
        precio: 27.00,
        categoria: "juguetes",
        descripcion: "Accesorios intercambiables.",
        imagen: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
        vendedor: "Kids World"
    },


    // 🍕 Alimentos (2)
    {
        nombre: "Café Premium Orgánico Peruano",
        precio: 18.90,
        categoria: "alimentos",
        descripcion: "Café 100% arábica de altura. Tueste medio. Notas de chocolate y frutos secos. 250g.",
        imagen: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        vendedor: "Café del Valle"
    },
    {
        nombre: "Aceite de Oliva Extra Virgen",
        precio: 32.00,
        categoria: "alimentos",
        descripcion: "Aceite de oliva extra virgen prensado en frío. Primera extracción. Botella de vidrio 500ml.",
        imagen: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
        vendedor: "Gourmet Market"
    },

    {
        nombre: "Chocolate Amargo 70%",
        precio: 6.90,
        categoria: "alimentos",
        descripcion: "Cacao premium.",
        imagen: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400",
        vendedor: "Dulce Andino"
    },
    {
        nombre: "Miel de Abeja Natural",
        precio: 12.00,
        categoria: "alimentos",
        descripcion: "100% pura.",
        imagen: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400",
        vendedor: "Campo Natural"
    },
    {
        nombre: "Granola Artesanal",
        precio: 9.90,
        categoria: "alimentos",
        descripcion: "Avena, frutos secos y miel.",
        imagen: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400",
        vendedor: "Vida Sana"
    },
    {
        nombre: "Arroz Integral Orgánico",
        precio: 5.50,
        categoria: "alimentos",
        descripcion: "Fuente de fibra.",
        imagen: "https://images.unsplash.com/photo-1604908177522-3d79d98c2c80?w=400",
        vendedor: "BioMarket"
    },
    {
        nombre: "Pasta Italiana",
        precio: 4.90,
        categoria: "alimentos",
        descripcion: "Trigo duro.",
        imagen: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
        vendedor: "Gourmet Market"
    },
    {
        nombre: "Salsa de Tomate Natural",
        precio: 3.80,
        categoria: "alimentos",
        descripcion: "Sin conservantes.",
        imagen: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
        vendedor: "Campo Vivo"
    },
    {
        nombre: "Té Verde Orgánico",
        precio: 7.50,
        categoria: "alimentos",
        descripcion: "Antioxidante natural.",
        imagen: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400",
        vendedor: "Herbal Life"
    },
    {
        nombre: "Galletas Integrales",
        precio: 4.20,
        categoria: "alimentos",
        descripcion: "Sin azúcar refinada.",
        imagen: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400",
        vendedor: "Vida Sana"
    }

];
