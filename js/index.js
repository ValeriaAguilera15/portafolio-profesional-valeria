const SUPABASE_URL = "https://ledstnkvvyikwzrpvwqp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2iA9nTQo83crjgEh9DDnDQ_19hk3dDj";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cargarPortafolio() {
    const { data: proyectos, error: errProj } = await _supabase
        .from('proyecto')
        .select(`
            id_proyecto, 
            titulo, 
            descripcion, 
            imagen, 
            url_demo, 
            categoria(nombre_categoria),
            proyecto_tecnologia(tecnologia(nombre))
        `);

    const { data: servicios, error: errServ } = await _supabase
        .from('servicio')
        .select('*');

    if (!errProj && proyectos) {
        const contenedorProyectos = document.getElementById('contenedor-proyectos');
        contenedorProyectos.innerHTML = '';
        proyectos.forEach(p => {
            const tecnologiasCard = p.proyecto_tecnologia
                ?.map(pt => `<span class="badge bg-secondary text-white me-1 small">${pt.tecnologia.nombre}</span>`)
                .join('') || '';

            contenedorProyectos.innerHTML += `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm border rounded-4 overflow-hidden bg-white">
                        <img src="${p.imagen}" alt="${p.titulo}" class="card-img-top img-fluid" style="height: 200px; object-fit: cover;">
                        <div class="card-body p-4">
                            <span class="badge bg-light text-purple mb-2 px-2.5 py-1.5 border fs-7">${p.categoria?.nombre_categoria || 'General'}</span>
                            <h4 class="fw-bold text-dark h5 mb-2">${p.titulo}</h4>
                            <p class="text-muted small mb-3">${p.descripcion}</p>
                            
                            <div class="mb-4">
                                ${tecnologiasCard}
                            </div>

                            <a href="${p.url_demo || '#'}" target="_blank" class="btn btn-purple btn-sm px-3 py-2 fw-medium btn-custom w-100">Ver Proyecto</a>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    if (!errServ && servicios) {
        const contenedorServicios = document.getElementById('contenedor-servicios');
        contenedorServicios.innerHTML = '';
        const iconos = ['./img/icon-code.png', './img/icon-gear.png', './img/icon-tag.png'];

        servicios.forEach((s, index) => {
            const icono = iconos[index] || './img/icon-code.png';
            contenedorServicios.innerHTML += `
                <div class="col-md-6 col-lg-4">
                    <div class="skill-card p-4 bg-white border rounded-4 h-100 shadow-sm">
                        <img src="${icono}" alt="${s.titulo}" class="img-fluid icon-skill mb-3">
                        <h5 class="fw-bold text-dark fs-5">${s.titulo}</h5>
                        <p class="small text-muted mt-3 mb-4">${s.descripcion}</p>
                        <span class="fw-bold text-purple bg-light px-3 py-2 rounded-3 small">Desde: $${s.precio}</span>
                    </div>
                </div>
            `;
        });
    }
}

document.addEventListener("DOMContentLoaded", cargarPortafolio);