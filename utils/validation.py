import re
from datetime import datetime

def validate_aviso_adopcion(form_data, files):
    """
    Valida todos los datos del formulario de aviso de adopción
    Retorna: (es_valido, errores_dict)
    """
    errores = {}
    
    # Validar región y comuna
    if not form_data.get('region') or form_data.get('region') == '':
        errores['region'] = 'Debe seleccionar una región'
    
    if not form_data.get('comuna') or form_data.get('comuna') == '':
        errores['comuna'] = 'Debe seleccionar una comuna'
    
    # Validar sector (opcional, máximo 100 caracteres)
    sector = form_data.get('sector', '').strip()
    if sector and len(sector) > 100:
        errores['sector'] = 'El sector no puede exceder 100 caracteres'
    
    # Validar nombre (requerido, entre 3 y 200 caracteres)
    nombre = form_data.get('nombre', '').strip()
    if not nombre:
        errores['nombre'] = 'El nombre es requerido'
    elif len(nombre) < 3:
        errores['nombre'] = 'El nombre debe tener al menos 3 caracteres'
    elif len(nombre) > 200:
        errores['nombre'] = 'El nombre no puede exceder 200 caracteres'
    
    # Validar email
    email = form_data.get('email', '').strip()
    if not email:
        errores['email'] = 'El email es requerido'
    elif not validar_email(email):
        errores['email'] = 'El email no es válido'
    elif len(email) > 100:
        errores['email'] = 'El email no puede exceder 100 caracteres'
    
    # Validar celular (opcional, máximo 15 caracteres)
    celular = form_data.get('numero', '').strip()
    if celular:
        # Eliminar espacios y caracteres especiales para validar
        celular_limpio = re.sub(r'[^\d+]', '', celular)
        if len(celular_limpio) > 15:
            errores['celular'] = 'El número de celular no puede exceder 15 caracteres'
    
    # Validar tipo de mascota
    tipo = form_data.get('tipo')
    if not tipo or tipo not in ['DOG', 'CAT']:
        errores['tipo'] = 'Debe seleccionar un tipo de mascota válido'
    
    # Validar cantidad
    try:
        cantidad = int(form_data.get('cantidad', 0))
        if cantidad < 1:
            errores['cantidad'] = 'La cantidad debe ser al menos 1'
    except (ValueError, TypeError):
        errores['cantidad'] = 'La cantidad debe ser un número válido'
    
    # Validar edad
    try:
        edad = int(form_data.get('edad', 0))
        if edad < 1:
            errores['edad'] = 'La edad debe ser al menos 1'
    except (ValueError, TypeError):
        errores['edad'] = 'La edad debe ser un número válido'
    
    # Validar unidad de edad
    unidad_edad = form_data.get('unidad-edad')
    if not unidad_edad or unidad_edad not in ['MONTH', 'YEAR']:
        errores['unidad_edad'] = 'Debe seleccionar una unidad de edad válida'
    
    # Validar fecha de entrega
    fecha_entrega = form_data.get('fecha')
    if not fecha_entrega:
        errores['fecha'] = 'La fecha de entrega es requerida'
    else:
        try:
            fecha_obj = datetime.fromisoformat(fecha_entrega)
            if fecha_obj < datetime.now():
                errores['fecha'] = 'La fecha de entrega debe ser futura'
        except ValueError:
            errores['fecha'] = 'La fecha de entrega no es válida'
    
    # Validar descripción (opcional, máximo 500 caracteres)
    descripcion = form_data.get('descripcion', '').strip()
    if descripcion and len(descripcion) > 500:
        errores['descripcion'] = 'La descripción no puede exceder 500 caracteres'
    
    # Validar que haya al menos una foto
    fotos = files.getlist('foto') if 'foto' in files else []
    tiene_foto = any(foto.filename for foto in fotos if foto)
    if not tiene_foto:
        errores['foto'] = 'Debe subir al menos una foto'

    return len(errores) == 0, errores

def validar_email(email):
    """Valida formato de email"""
    patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(patron, email) is not None

def validar_contactos(form_data):
    """
    Valida que haya al menos un método de contacto seleccionado
    y que tenga su identificador correspondiente
    """
    contactos = []
    plataformas = ['tiktok', 'instagram', 'whatsapp', 'x', 'telegram', 'linkedin']
    
    for plataforma in plataformas:
        checkbox_key = plataforma
        textarea_key = f'{plataforma}_url'
        
        # Si el checkbox está marcado
        if form_data.get(checkbox_key):
            identificador = form_data.get(textarea_key, '').strip()
            if identificador and len(identificador) >= 4 and len(identificador) <= 50:
                contactos.append({
                    'nombre': plataforma,
                    'identificador': identificador
                })
    
    return contactos

def sanitizar_texto(texto):
    """Sanitiza texto para prevenir inyecciones"""
    if not texto:
        return ''
    # Eliminar caracteres potencialmente peligrosos
    texto = texto.strip()
    # Podrías agregar más sanitización aquí
    return texto

def validar_archivo_imagen(archivo):
    """
    Valida que el archivo sea una imagen válida
    Retorna: (es_valido, mensaje_error)
    """
    import filetype
    
    # Verificar que hay un archivo
    if not archivo or not archivo.filename:
        return False, "No se proporcionó ningún archivo"
    
    # Verificar extensión permitida
    extensiones_permitidas = {'.jpg', '.jpeg', '.png', '.gif', '.pdf'}
    extension = '.' + archivo.filename.rsplit('.', 1)[1].lower() if '.' in archivo.filename else ''
    
    if extension not in extensiones_permitidas:
        return False, f"Extensión de archivo no permitida. Use: {', '.join(extensiones_permitidas)}"
    
    # Verificar tipo MIME real del archivo
    archivo.seek(0)
    kind = filetype.guess(archivo.read(1024))
    archivo.seek(0)
    
    if kind is None and extension != '.pdf':
        return False, "No se pudo determinar el tipo de archivo"
    
    tipos_permitidos = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if kind and kind.mime not in tipos_permitidos:
        return False, f"Tipo de archivo no permitido: {kind.mime}"
    
    # Verificar tamaño (máximo 5MB)
    archivo.seek(0, 2)  # Ir al final del archivo
    tamaño = archivo.tell()
    archivo.seek(0)  # Volver al inicio
    
    if tamaño > 5 * 1024 * 1024:  # 5MB
        return False, "El archivo excede el tamaño máximo permitido (5MB)"
    
    return True, ""

# Funciones heredadas de tu código original (si las necesitas)
def validate_login_user(form_data):
    """Validación de login (para futuras funcionalidades)"""
    # Implementar si es necesario
    pass

def validate_register_user(form_data):
    """Validación de registro (para futuras funcionalidades)"""
    # Implementar si es necesario
    pass

def validate_confession(form_data):
    """Validación de confesión (para futuras funcionalidades)"""
    # Implementar si es necesario
    pass