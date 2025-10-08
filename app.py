from flask import Flask, request, render_template, redirect, url_for, jsonify, flash
from werkzeug.utils import secure_filename
from utils.validation import (validate_aviso_adopcion, validar_contactos, validar_archivo_imagen, sanitizar_texto)
from database import db
import hashlib
import os
from datetime import datetime

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}

app = Flask(__name__)
app.secret_key = 's3cr3t_k3y'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#Crear carpeta de uploads si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def generar_nombre_archivo(archivo):
    """Genera un nombre único para el archivo usando hash"""
    nombre_original = secure_filename(archivo.filename)
    extension = nombre_original.rsplit('.', 1)[1].lower() if '.' in nombre_original else 'jpg'
    
    #Crear hash basado en contenido y timestamp
    archivo.seek(0)
    contenido = archivo.read()
    archivo.seek(0)
    
    hash_nombre = hashlib.md5(
        contenido + str(datetime.now().timestamp()).encode()
    ).hexdigest()
    
    return f"{hash_nombre}.{extension}", nombre_original

@app.route('/')
def index():
    """Página principal con los últimos 5 avisos"""
    try:
        avisos_raw = db.get_ultimos_avisos(5)
        # Convertir tuplas a diccionarios
        avisos = []
        for aviso in avisos_raw:
            avisos.append({
                'id': aviso[0],
                'fecha_ingreso': aviso[1],
                'comuna': aviso[2],
                'sector': aviso[3],
                'tipo': aviso[4],
                'cantidad': aviso[5],
                'edad': aviso[6],
                'unidad_medida': aviso[7],
                'foto': aviso[8]
            })
        return render_template('index.html', avisos=avisos)
    except Exception as e:
        print(f"Error en index: {e}")
        import traceback
        traceback.print_exc()
        return render_template('index.html', avisos=[])

@app.route('/agregar-aviso')
def agregar_aviso():
    """Muestra el formulario para agregar un aviso"""
    return render_template('add.html')

@app.route('/api/regiones', methods=['GET'])
def api_regiones():
    """API para obtener regiones"""
    try:
        regiones_raw = db.get_regiones()
        regiones = [{'id': r[0], 'nombre': r[1]} for r in regiones_raw]
        return jsonify(regiones)
    except Exception as e:
        print(f"Error en api_regiones: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/comunas/<int:region_id>', methods=['GET'])
def api_comunas(region_id):
    """API para obtener comunas de una región"""
    try:
        comunas_raw = db.get_comunas_por_region(region_id)
        comunas = [{'id': c[0], 'nombre': c[1]} for c in comunas_raw]
        return jsonify(comunas)
    except Exception as e:
        print(f"Error en api_comunas: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/agregar-aviso', methods=['POST'])
def procesar_aviso():
    """Procesa el formulario de agregar aviso de adopción"""
    try:
        # Validar datos del formulario
        es_valido, errores = validate_aviso_adopcion(request.form, request.files)
        
        if not es_valido:
            return render_template('add.html', errores=errores, form_data=request.form), 400
        
        # Preparar datos para inserción
        tipo_mascota = 'gato' if request.form.get('tipo') == 'CAT' else 'perro'
        unidad_medida = 'm' if request.form.get('unidad-edad') == 'MONTH' else 'a'
        
        # USAR LA FUNCIÓN CORRECTA: create_aviso_adopcion
        aviso_id = db.create_aviso_adopcion(
            datetime.now().strftime('%Y-%m-%d %H:%M:%S'),  # fecha_ingreso
            int(request.form.get('comuna')),  # comuna_id
            sanitizar_texto(request.form.get('sector', '')),  # sector
            sanitizar_texto(request.form.get('nombre')),  # nombre
            sanitizar_texto(request.form.get('email')),  # email
            sanitizar_texto(request.form.get('numero', '')),  # celular
            tipo_mascota,  # tipo
            int(request.form.get('cantidad')),  # cantidad
            int(request.form.get('edad')),  # edad
            unidad_medida,  # unidad_medida
            request.form.get('fecha'),  # fecha_entrega
            sanitizar_texto(request.form.get('descripcion', ''))  # descripcion
        )
        
        # Procesar y guardar fotos
        fotos = request.files.getlist('foto')
        for foto in fotos:
            if foto and foto.filename:
                es_valido_archivo, mensaje_error = validar_archivo_imagen(foto)
                if not es_valido_archivo:
                    continue
                
                nombre_archivo, nombre_original = generar_nombre_archivo(foto)
                ruta_completa = os.path.join(app.config['UPLOAD_FOLDER'], nombre_archivo)
                foto.save(ruta_completa)
                
                ruta_bd = f'/static/uploads/{nombre_archivo}'
                # USAR LA FUNCIÓN CORRECTA: create_foto
                db.create_foto(ruta_bd, nombre_original, aviso_id)
        
        # Procesar métodos de contacto
        contactos = validar_contactos(request.form)
        for contacto in contactos:
            nombre_bd = contacto['nombre'].lower()
            if nombre_bd == 'x':
                nombre_bd = 'X'
            
            # USAR LA FUNCIÓN CORRECTA: create_contacto
            db.create_contacto(nombre_bd, contacto['identificador'], aviso_id)
        
        flash('¡Aviso de adopción agregado exitosamente!', 'success')
        return redirect(url_for('index'))
        
    except Exception as e:
        print(f"Error al procesar aviso: {e}")
        import traceback
        traceback.print_exc()
        flash('Hubo un error al procesar el aviso. Por favor intente nuevamente.', 'error')
        return render_template('add.html', form_data=request.form), 500

@app.route('/adopciones')
def listado_adopciones():
    """Muestra el listado paginado de adopciones"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = 5
        offset = (page - 1) * per_page
        
        # Obtener avisos paginados
        avisos_raw = db.get_avisos_paginados(per_page, offset)
        total = db.get_total_avisos()
        
        # Convertir a diccionarios y obtener información completa de cada aviso
        avisos = []
        for aviso in avisos_raw:
            aviso_id = aviso[0]
            
            # Obtener detalle completo del aviso (incluyendo contactos)
            detalle = db.get_aviso_detalle(aviso_id)
            
            if detalle:
                aviso_completo = detalle['aviso']
                avisos.append({
                    'id': aviso_completo[0],
                    'fecha_ingreso': aviso_completo[1],
                    'comuna_id': aviso_completo[2],
                    'comuna': aviso_completo[3],
                    'sector': aviso_completo[6],
                    'nombre': aviso_completo[7],
                    'email': aviso_completo[8],
                    'celular': aviso_completo[9],
                    'tipo': aviso_completo[10],
                    'cantidad': aviso_completo[11],
                    'edad': aviso_completo[12],
                    'unidad_medida': aviso_completo[13],
                    'fecha_entrega': aviso_completo[14],
                    'descripcion': aviso_completo[15],
                    'foto': detalle['fotos'][0][1] if detalle['fotos'] else None,
                    'fotos': [{'ruta_archivo': f[1], 'nombre_archivo': f[2]} for f in detalle['fotos']] if detalle['fotos'] else [],
                    'contactos': [{'nombre': c[1], 'identificador': c[2]} for c in detalle['contactos']]
                })
        
        total_paginas = (total + per_page - 1) // per_page
        
        return render_template('adopt.html', 
                             avisos=avisos, 
                             page=page, 
                             total_paginas=total_paginas,
                             total=total)
    except Exception as e:
        print(f"Error en listado: {e}")
        import traceback
        traceback.print_exc()
        return render_template('adopt.html', avisos=[], page=1, total_paginas=0, total=0)

@app.route('/aviso/<int:aviso_id>')
def detalle_aviso(aviso_id):
    """Muestra el detalle de un aviso específico"""
    try:
        detalle = db.get_aviso_detalle(aviso_id)
        if not detalle:
            flash('Aviso no encontrado', 'error')
            return redirect(url_for('listado_adopciones'))
        
        return render_template('detalle.html', detalle=detalle)
    except Exception as e:
        print(f"Error al obtener detalle: {e}")
        flash('Error al cargar el aviso', 'error')
        return redirect(url_for('listado_adopciones'))

@app.route('/estadisticas')
def estadisticas():
    return render_template('stats.html')

if __name__ == '__main__':
    app.run(debug=True)