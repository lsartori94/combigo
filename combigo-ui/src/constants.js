const path = window.location.hostname;

export const API_BASE = `http://${path}:5000/api/v1`;
export const SESSION_KEY = 'CGOSESS';

export const TRAVEL_STATES = {
  NOT_STARTED: "Pendiente",
  IN_PROGRESS: "En Curso",
  FINISHED: "Terminado",
  CANCELED: "Cancelado",
  NO_VEHICLE: "Sin Vehiculo"
}
export const LEGAL_STATUS = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado"
}

export const VIP_STATUS = {
  ENROLLED: "ENROLLED",
  NOT_ENROLLED: "NOT_ENROLLED"
}

export const VIP_STATUS_MSG = {
  ENROLLED: "Subscripto",
  NOT_ENROLLED: "No Subscripto"
}
