const ROLES = {
  ADMIN: 'ADMIN',
  DRIVER: 'DRIVER',
  CLIENT: 'CLIENT'
}

const TRAVEL_STATES = {
  NOT_STARTED: "Pendiente",
  IN_PROGRESS: "En Curso",
  FINISHED: "Terminado",
  CANCELED: "Cancelado",
  NO_VEHICLE: "Sin Vehiculo"
}

const BOOKING_STATES = {
  PENDING: "Pendiente",
  ACTIVE: "En Curso",
  COMPLETED: "Finalizada",
  ABSENT: "Ausente",
  FULL_REFUND: "Reembolsada 100%",
  HALF_REFUND: "Reembolsada 50%",
  CANCELED: "Cancelada (100% Reembolso)"
}

const LEGAL_STATUS = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado"
}

const VIP_STATUS = {
  NOT_ENROLLED: "NOT_ENROLLED",
  ENROLLED: "ENROLLED"
}

module.exports = {
  ROLES,
  TRAVEL_STATES,
  BOOKING_STATES,
  LEGAL_STATUS,
  VIP_STATUS
};
