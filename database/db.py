import pymysql
import json

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
DB_CHARSET = "utf8"

# Cargar queries desde JSON
with open('database/querys.json', 'r') as querys:
    QUERY_DICT = json.load(querys)

# -- Conexión --
def get_conn():
    """Obtiene una conexión a la base de datos"""
    conn = pymysql.connect(
        db=DB_NAME,
        user=DB_USERNAME,
        passwd=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        charset=DB_CHARSET
    )
    return conn

# -- Queries de Regiones y Comunas --
def get_regiones():
    """Obtiene todas las regiones"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_regiones"])
    regiones = cursor.fetchall()
    conn.close()
    return regiones

def get_comunas_por_region(region_id):
    """Obtiene las comunas de una región específica"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_comunas_por_region"], (region_id,))
    comunas = cursor.fetchall()
    conn.close()
    return comunas

# -- Queries de Avisos de Adopción --
def create_aviso_adopcion(fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion):
    """Inserta un nuevo aviso de adopción y retorna el ID generado"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(
        QUERY_DICT["create_aviso_adopcion"],
        (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion)
    )
    conn.commit()
    aviso_id = cursor.lastrowid
    conn.close()
    return aviso_id

def get_ultimos_avisos(limite):
    """Obtiene los últimos N avisos de adopción"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_ultimos_avisos"], (limite,))
    avisos = cursor.fetchall()
    conn.close()
    return avisos

def get_avisos_paginados(limite, offset):
    """Obtiene avisos con paginación"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_avisos_paginados"], (limite, offset))
    avisos = cursor.fetchall()
    conn.close()
    return avisos

def get_total_avisos():
    """Cuenta el total de avisos en la base de datos"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_total_avisos"])
    total = cursor.fetchone()[0]
    conn.close()
    return total

def get_aviso_by_id(aviso_id):
    """Obtiene un aviso específico por su ID"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_aviso_by_id"], (aviso_id,))
    aviso = cursor.fetchone()
    conn.close()
    return aviso

# -- Queries de Fotos --
def create_foto(ruta_archivo, nombre_archivo, actividad_id):
    """Inserta una foto asociada a un aviso"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(
        QUERY_DICT["create_foto"],
        (ruta_archivo, nombre_archivo, actividad_id)
    )
    conn.commit()
    conn.close()

def get_fotos_by_aviso(aviso_id):
    """Obtiene todas las fotos de un aviso"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_fotos_by_aviso"], (aviso_id,))
    fotos = cursor.fetchall()
    conn.close()
    return fotos

def get_primera_foto_by_aviso(aviso_id):
    """Obtiene la primera foto de un aviso"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_primera_foto_by_aviso"], (aviso_id,))
    foto = cursor.fetchone()
    conn.close()
    return foto

# -- Queries de Contactos --
def create_contacto(nombre, identificador, actividad_id):
    """Inserta un método de contacto para un aviso"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(
        QUERY_DICT["create_contacto"],
        (nombre, identificador, actividad_id)
    )
    conn.commit()
    conn.close()

def get_contactos_by_aviso(aviso_id):
    """Obtiene todos los métodos de contacto de un aviso"""
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_contactos_by_aviso"], (aviso_id,))
    contactos = cursor.fetchall()
    conn.close()
    return contactos

# -- Funciones de negocio --
def insertar_aviso_completo(datos_aviso, fotos_list, contactos_list):
    """
    Inserta un aviso completo con sus fotos y contactos
    Retorna: (success, aviso_id o mensaje_error)
    """
    try:
        # 1. Insertar el aviso de adopción
        aviso_id = create_aviso_adopcion(
            datos_aviso['fecha_ingreso'],
            datos_aviso['comuna_id'],
            datos_aviso['sector'],
            datos_aviso['nombre'],
            datos_aviso['email'],
            datos_aviso['celular'],
            datos_aviso['tipo'],
            datos_aviso['cantidad'],
            datos_aviso['edad'],
            datos_aviso['unidad_medida'],
            datos_aviso['fecha_entrega'],
            datos_aviso['descripcion']
        )
        
        # 2. Insertar las fotos
        for foto in fotos_list:
            create_foto(foto['ruta_archivo'], foto['nombre_archivo'], aviso_id)
        
        # 3. Insertar los contactos
        for contacto in contactos_list:
            create_contacto(contacto['nombre'], contacto['identificador'], aviso_id)
        
        return True, aviso_id
    except Exception as e:
        return False, str(e)

def get_aviso_detalle(aviso_id):
    """
    Obtiene el detalle completo de un aviso con sus fotos y contactos
    Retorna: diccionario con toda la información o None
    """
    # Obtener datos básicos del aviso
    aviso = get_aviso_by_id(aviso_id)
    if not aviso:
        return None
    
    # Obtener fotos
    fotos = get_fotos_by_aviso(aviso_id)
    
    # Obtener contactos
    contactos = get_contactos_by_aviso(aviso_id)
    
    # Estructura de retorno
    return {
        'aviso': aviso,
        'fotos': fotos,
        'contactos': contactos
    }