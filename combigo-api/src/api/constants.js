const ROLES = {
  ADMIN: 'ADMIN',
  DRIVER: 'DRIVER',
  CLIENT: 'CLIENT'
}

const TRAVEL_STATES = {
  NOT_STARTED: "Pendiente",
  IN_PROGRESS: "En Progreso",
  FINISHED: "Terminado",
  CANCELED: "Cancelado"
}

const BOOKING_STATES = {
  ACTIVE: "Activa",
  COMPLETED: "Finalizada",
  FULL_REFUND: "reembolsada 100%",
  HALF_REFUND: "reembolsada 50%",
  CANCELED: "Cancelada"
}

const LEGAL_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
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
