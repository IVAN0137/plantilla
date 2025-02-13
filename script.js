document.addEventListener('DOMContentLoaded', () => {
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    const handleScroll = () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.boxShadow = 'none';
        }
    }

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.cabana, .servicio, .ubicacion-content, #reservaForm');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            element.style.opacity = 0;
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
        });
    }

    const handleReservaForm = () => {
        const form = document.getElementById('reservaForm');
        const fields = ['nombre', 'email', 'telefono', 'cabana', 'fechaLlegada', 'fechaSalida'];

        const showError = (field, message) => {
            const formGroup = field.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            formGroup.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        };

        const hideError = (field) => {
            const formGroup = field.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            formGroup.classList.remove('error');
            errorElement.style.display = 'none';
        };

        const validateField = (field) => {
            if (field.value.trim() === '') {
                showError(field, 'Este campo es requerido');
                return false;
            }

            if (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
                showError(field, 'Por favor, introduce un email válido');
                return false;
            }

            if (field.id === 'telefono' && !/^\d{9,}$/.test(field.value)) {
                showError(field, 'Por favor, introduce un número de teléfono válido');
                return false;
            }

            hideError(field);
            return true;
        };

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => validateField(field));
        });

        const validateDates = () => {
            const llegada = new Date(document.getElementById('fechaLlegada').value);
            const salida = new Date(document.getElementById('fechaSalida').value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (llegada < today) {
                showError(document.getElementById('fechaLlegada'), 'La fecha de llegada no puede ser en el pasado');
                return false;
            }

            if (salida <= llegada) {
                showError(document.getElementById('fechaSalida'), 'La fecha de salida debe ser posterior a la fecha de llegada');
                return false;
            }

            hideError(document.getElementById('fechaLlegada'));
            hideError(document.getElementById('fechaSalida'));
            return true;
        };

        document.getElementById('fechaLlegada').addEventListener('change', validateDates);
        document.getElementById('fechaSalida').addEventListener('change', validateDates);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!validateDates()) {
                isValid = false;
            }

            if (isValid) {
                const formData = new FormData(form);
                const reservaData = Object.fromEntries(formData.entries());

                const whatsappMessage = `Hola, me gustaría hacer una reserva:
                Nombre: ${reservaData.nombre}
                Email: ${reservaData.email}
                Teléfono: ${reservaData.telefono}
                Cabaña: ${reservaData.cabana}
                Fecha de llegada: ${reservaData.fechaLlegada}
                Fecha de salida: ${reservaData.fechaSalida}
                Mensaje: ${reservaData.mensaje}`;

                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappUrl = `https://wa.me/524412822828?text=${encodedMessage}`; // Reemplaza 1234567890 con tu número de WhatsApp

                window.open(whatsappUrl, '_blank');
                form.reset();
            }
        });
    }

    const handleModal = () => {
        const modal = document.getElementById('modal');
        const btnsDetalles = document.querySelectorAll('.btn-detalles');
        const closeBtn = document.querySelector('.close');
        const reservaBtn = document.getElementById('modal-reserva');

        const cabanaDetails = {
            bosque: {
                title: 'Cabaña del Bosque',
                image: 'https://source.unsplash.com/800x600/?forest+cabin',
                description: 'Sumérgete en la tranquilidad del bosque con esta acogedora cabaña. Perfecta para los amantes de la naturaleza.',
                amenities: ['Chimenea', 'Terraza con vista al bosque', 'Cocina equipada', 'Wi-Fi'],
                price: '$150 por noche'
            },
            lago: {
                title: 'Cabaña del Lago',
                image: 'https://source.unsplash.com/800x600/?lake+cabin',
                description: 'Disfruta de impresionantes vistas al lago desde esta hermosa cabaña. Ideal para actividades acuáticas.',
                amenities: ['Acceso directo al lago', 'Muelle privado', 'Botes disponibles', 'Terraza panorámica'],
                price: '$180 por noche'
            },
            montana: {
                title: 'Cabaña de Montaña',
                image: 'https://source.unsplash.com/800x600/?mountain+cabin',
                description: 'Experimenta la majestuosidad de las alturas en esta cabaña de montaña. Perfecta para los amantes del senderismo.',
                amenities: ['Vistas panorámicas', 'Equipo de senderismo', 'Jacuzzi exterior', 'Sala de juegos'],
                price: '$200 por noche'
            },
            lujo: {
                title: 'Cabaña de Lujo',
                image: 'https://source.unsplash.com/800x600/?luxury+cabin',
                description: 'Vive el confort en medio de la naturaleza con nuestra cabaña de lujo. Una experiencia premium para los más exigentes.',
                amenities: ['Piscina privada', 'Sauna', 'Servicio de chef privado', 'Cine en casa'],
                price: '$350 por noche'
            }
        };

        btnsDetalles.forEach(btn => {
            btn.addEventListener('click', () => {
                const cabana = btn.getAttribute('data-cabana');
                const details = cabanaDetails[cabana];

                document.getElementById('modal-title').textContent = details.title;
                document.getElementById('modal-image').src = details.image;
                document.getElementById('modal-description').textContent = details.description;
                
                const amenitiesList = document.getElementById('modal-amenities');
                amenitiesList.innerHTML = '';
                details.amenities.forEach(amenity => {
                    const li = document.createElement('li');
                    li.textContent = amenity;
                    amenitiesList.appendChild(li);
                });

                document.getElementById('modal-price').textContent = details.price;

                modal.style.display = 'block';

                // Actualizar el botón de reserva con la cabaña seleccionada
                reservaBtn.setAttribute('data-cabana', details.title);
            });
        });

        reservaBtn.addEventListener('click', () => {
            const cabanaSeleccionada = reservaBtn.getAttribute('data-cabana');
            const selectCabana = document.getElementById('cabana');
            selectCabana.value = cabanaSeleccionada;

            modal.style.display = 'none';
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    const handleMap = () => {
        const lat = -34.6037; // Reemplaza con la latitud real de las cabañas
        const lon = -58.3816; // Reemplaza con la longitud real de las cabañas

        const map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup("<b>Cabañas Encantadas</b><br>Tu escape perfecto en la naturaleza.").openPopup();

        const btnComoLlegar = document.getElementById('btn-como-llegar');
        btnComoLlegar.addEventListener('click', () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    
                    // Crear una ruta desde la ubicación del usuario hasta las cabañas
                    const url = `https://www.openstreetmap.org/directions?engine=osrm_car&route=${userLat},${userLon};${lat},${lon}`;
                    window.open(url, '_blank');
                }, () => {
                    alert("No se pudo obtener tu ubicación. Por favor, intenta de nuevo.");
                });
            } else {
                alert("Tu navegador no soporta geolocalización.");
            }
        });
    }

    const improveFooterAccessibility = () => {
        const socialLinks = document.querySelectorAll('.redes-sociales a');
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                const networkName = icon.className.split('-')[2]; // Obtiene el nombre de la red social
                link.setAttribute('aria-label', `Síguenos en ${networkName}`);
            }
        });
    }

    navSlide();
    window.addEventListener('scroll', handleScroll);
    animateOnScroll();
    handleReservaForm();
    handleModal();
    handleMap(); 
    improveFooterAccessibility();
});

