// jgnext:admin-pack — gerado do schema. Não edite à mão.
export type AgendaCfg = { model: string; dateField: string; timeField: string | null; clientNameField: string | null; statusField: string | null; statusOptions: string[]; relations: { field: string; model: string; label: string; person?: boolean }[] };
export const PACK: { agenda: AgendaCfg | null } = {
  "agenda": {
    "model": "Booking",
    "dateField": "schedulingDate",
    "timeField": null,
    "clientNameField": null,
    "statusField": "status",
    "statusOptions": [
      "pendente",
      "confirmado",
      "concluido",
      "cancelado"
    ],
    "relations": [
      {
        "field": "classId",
        "model": "Class",
        "label": "Class",
        "person": false
      },
      {
        "field": "userId",
        "model": "User",
        "label": "User",
        "person": false
      }
    ]
  }
};
