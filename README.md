# Gestor de Tareas con Estados Personalizables

## Descripción

Esta aplicación es un gestor de tareas que permite a los usuarios crear, editar, eliminar y organizar tareas en diferentes estados. Los estados son personalizables y se pueden agregar o eliminar según las necesidades del usuario.

## Funcionalidades Principales

- **Gestión de Tareas**: Crear, editar, eliminar y restaurar tareas.
- **Estados Personalizables**: Agregar y eliminar estados de tareas.
- **Vista Kanban**: Visualizar tareas en un tablero Kanban con columnas para cada estado.
- **Vista de Tabla**: Visualizar tareas en una tabla con opciones para cambiar el estado desde un menú desplegable.
- **Papelera**: Restaurar o eliminar permanentemente tareas desde la papelera.
- **Alertas**: Notificaciones para acciones importantes como creación, edición y eliminación de tareas.

## Decisiones Técnicas

- **Angular**: Framework principal para la construcción de la aplicación.
- **Componentes Reutilizables**: Uso de componentes reutilizables para tareas, estados y alertas.
- **Servicios**: Implementación de servicios para la gestión de tareas y estados.
- **SCSS**: Uso de SCSS para estilos modulares y variables globales.
- **Señales y Computados**: Uso de señales y computados para la gestión reactiva del estado de la aplicación.

## Cómo Usar la Aplicación

### Requisitos Previos

- Node.js y npm instalados en tu máquina.

### Instalación

1. Clona el repositorio:
  ```bash
  git clone https://github.com/samrx21/task-manager.git
  cd gestor-tareas
  npm install
  ng serve
  ```

2. Abre tu navegador y navega a [http://localhost:4200](http://localhost:4200).

### Uso

#### Crear Tarea:

1. Haz clic en el botón "+" o (Agregar Tarea)" segun la vista en la que estes (tarjetas o Tabla).
2. Completa el formulario y selecciona el estado inicial.
3. Haz clic en "Guardar".

#### Editar Tarea:

1. En la vista Kanban, haz hover sobre la tarea y haz clic en el icono de lápiz en la tarjeta de tarea.
2. En la vista de tabla, haz clic en el icono de lápiz en la fila de tarea.
3. Edita el título y guarda los cambios.

#### Eliminar Tarea:

1. Haz clic en el icono de papelera en la tarjeta o fila de tarea.
2. La tarea se moverá a la papelera.

#### Restaurar o Eliminar Permanentemente Tareas:

1. Haz clic en el icono de papelera en la parte superior derecha para abrir la papelera.
2. Haz clic en el icono de restaurar o eliminar permanentemente junto a la tarea.

#### Gestionar Estados:

1. Haz clic en el botón "Estados" en la parte superior.
2. Agrega o elimina estados según sea necesario.
