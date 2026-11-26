// jgnext:admin-data — gerado do prisma/schema.prisma. Não edite à mão: é recriado a cada geração.
export type FieldMeta = {
  name: string; label: string; kind: 'text' | 'int' | 'float' | 'decimal' | 'bool' | 'datetime' | 'json' | 'enum';
  optional: boolean; required: boolean; writable: boolean; hidden: boolean; long?: boolean; options?: string[];
  relation?: string; defaultBool?: boolean; defaultValue?: string;
};
export type ModelMeta = {
  name: string; delegate: string; label: string; idField: string; idKind: 'string' | 'int'; labelField: string;
  optionsOnly?: boolean; select: Record<string, true>; fields: FieldMeta[];
};
export const MODELS: Record<string, ModelMeta> = {
  "User": {
    "name": "User",
    "delegate": "user",
    "label": "Usuários",
    "idField": "id",
    "idKind": "string",
    "labelField": "name",
    "optionsOnly": true,
    "select": {
      "id": true,
      "name": true,
      "email": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "name",
        "label": "Name",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": false,
        "hidden": false
      },
      {
        "name": "email",
        "label": "Email",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": false,
        "hidden": false
      }
    ]
  },
  "Project": {
    "name": "Project",
    "delegate": "project",
    "label": "Projetos",
    "idField": "id",
    "idKind": "string",
    "labelField": "name",
    "select": {
      "id": true,
      "name": true,
      "ownerId": true,
      "createdAt": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "name",
        "label": "Name",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "ownerId",
        "label": "Owner",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "User"
      },
      {
        "name": "createdAt",
        "label": "Created at",
        "kind": "datetime",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": false
      }
    ]
  },
  "Plan": {
    "name": "Plan",
    "delegate": "plan",
    "label": "Planos",
    "idField": "id",
    "idKind": "string",
    "labelField": "name",
    "select": {
      "id": true,
      "name": true,
      "price": true,
      "durationMonths": true,
      "limitClassesPerMonth": true,
      "description": true,
      "type": true,
      "active": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "name",
        "label": "Name",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "price",
        "label": "Price",
        "kind": "decimal",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "durationMonths",
        "label": "Duration months",
        "kind": "int",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "limitClassesPerMonth",
        "label": "Limit classes per month",
        "kind": "int",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "description",
        "label": "Description",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "type",
        "label": "Type",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "active",
        "label": "Active",
        "kind": "bool",
        "optional": false,
        "required": false,
        "writable": true,
        "hidden": false,
        "defaultBool": true
      }
    ]
  },
  "Class": {
    "name": "Class",
    "delegate": "class",
    "label": "Aulas",
    "idField": "id",
    "idKind": "string",
    "labelField": "name",
    "select": {
      "id": true,
      "name": true,
      "type": true,
      "duration": true,
      "level": true,
      "description": true,
      "capacity": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "name",
        "label": "Name",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "type",
        "label": "Type",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "duration",
        "label": "Duration",
        "kind": "int",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "level",
        "label": "Level",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "description",
        "label": "Description",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "capacity",
        "label": "Capacity",
        "kind": "int",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      }
    ]
  },
  "Booking": {
    "name": "Booking",
    "delegate": "booking",
    "label": "Reservas",
    "idField": "id",
    "idKind": "string",
    "labelField": "status",
    "select": {
      "id": true,
      "schedulingDate": true,
      "status": true,
      "price": true,
      "observations": true,
      "confirmationCode": true,
      "classId": true,
      "paymentId": true,
      "userId": true,
      "checkInId": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "schedulingDate",
        "label": "Scheduling date",
        "kind": "datetime",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "status",
        "label": "Situação",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "price",
        "label": "Price",
        "kind": "decimal",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "observations",
        "label": "Observations",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "confirmationCode",
        "label": "Confirmation code",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "classId",
        "label": "Class",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "Class"
      },
      {
        "name": "paymentId",
        "label": "Payment",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false,
        "relation": "Payment"
      },
      {
        "name": "userId",
        "label": "User",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "User"
      },
      {
        "name": "checkInId",
        "label": "Check in id",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false
      }
    ]
  },
  "Workout": {
    "name": "Workout",
    "delegate": "workout",
    "label": "Treinos",
    "idField": "id",
    "idKind": "string",
    "labelField": "name",
    "select": {
      "id": true,
      "name": true,
      "description": true,
      "totalDuration": true,
      "level": true,
      "active": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "name",
        "label": "Name",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "description",
        "label": "Description",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "totalDuration",
        "label": "Total duration",
        "kind": "int",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "level",
        "label": "Level",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "active",
        "label": "Active",
        "kind": "bool",
        "optional": false,
        "required": false,
        "writable": true,
        "hidden": false,
        "defaultBool": true
      }
    ]
  },
  "Exercise": {
    "name": "Exercise",
    "delegate": "exercise",
    "label": "Exercícios",
    "idField": "id",
    "idKind": "string",
    "labelField": "name",
    "select": {
      "id": true,
      "name": true,
      "type": true,
      "duration": true,
      "repetitions": true,
      "description": true,
      "image": true,
      "workoutId": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "name",
        "label": "Name",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "type",
        "label": "Type",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "duration",
        "label": "Duration",
        "kind": "int",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "repetitions",
        "label": "Repetitions",
        "kind": "int",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "description",
        "label": "Description",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "image",
        "label": "Image",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false
      },
      {
        "name": "workoutId",
        "label": "Workout",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "Workout"
      }
    ]
  },
  "Progress": {
    "name": "Progress",
    "delegate": "progress",
    "label": "Progresso",
    "idField": "id",
    "idKind": "string",
    "labelField": "level",
    "select": {
      "id": true,
      "registerDate": true,
      "weight": true,
      "fatPercentage": true,
      "level": true,
      "observations": true,
      "bookingId": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "registerDate",
        "label": "Register date",
        "kind": "datetime",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "weight",
        "label": "Weight",
        "kind": "decimal",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false
      },
      {
        "name": "fatPercentage",
        "label": "Fat percentage",
        "kind": "decimal",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false
      },
      {
        "name": "level",
        "label": "Level",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false
      },
      {
        "name": "observations",
        "label": "Observations",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "bookingId",
        "label": "Booking",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "Booking"
      }
    ]
  },
  "CheckIn": {
    "name": "CheckIn",
    "delegate": "checkIn",
    "label": "Check-ins",
    "idField": "id",
    "idKind": "string",
    "labelField": "hour",
    "select": {
      "id": true,
      "date": true,
      "hour": true,
      "present": true,
      "observations": true,
      "bookingId": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "date",
        "label": "Date",
        "kind": "datetime",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "hour",
        "label": "Hour",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "present",
        "label": "Present",
        "kind": "bool",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "observations",
        "label": "Observations",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "bookingId",
        "label": "Booking",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "Booking"
      }
    ]
  },
  "Payment": {
    "name": "Payment",
    "delegate": "payment",
    "label": "Pagamentos",
    "idField": "id",
    "idKind": "string",
    "labelField": "description",
    "select": {
      "id": true,
      "paymentDate": true,
      "value": true,
      "method": true,
      "status": true,
      "description": true,
      "bookingId": true,
      "planId": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "paymentDate",
        "label": "Payment date",
        "kind": "datetime",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "value",
        "label": "Value",
        "kind": "decimal",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "method",
        "label": "Method",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "status",
        "label": "Situação",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "description",
        "label": "Description",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "bookingId",
        "label": "Booking id",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false
      },
      {
        "name": "planId",
        "label": "Plan",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false,
        "relation": "Plan"
      }
    ]
  },
  "StudioInfo": {
    "name": "StudioInfo",
    "delegate": "studioInfo",
    "label": "Studio infos",
    "idField": "id",
    "idKind": "string",
    "labelField": "name",
    "select": {
      "id": true,
      "name": true,
      "address": true,
      "phone": true,
      "email": true,
      "workingHours": true,
      "description": true,
      "coverImage": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "name",
        "label": "Name",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "address",
        "label": "Address",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "phone",
        "label": "Phone",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "email",
        "label": "Email",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "workingHours",
        "label": "Working hours",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "description",
        "label": "Description",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "coverImage",
        "label": "Cover image",
        "kind": "text",
        "optional": true,
        "required": false,
        "writable": true,
        "hidden": false
      }
    ]
  },
  "GalleryImage": {
    "name": "GalleryImage",
    "delegate": "galleryImage",
    "label": "Gallery images",
    "idField": "id",
    "idKind": "string",
    "labelField": "title",
    "select": {
      "id": true,
      "title": true,
      "description": true,
      "url": true,
      "uploadDate": true,
      "studioId": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "title",
        "label": "Title",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "description",
        "label": "Description",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "long": true
      },
      {
        "name": "url",
        "label": "Url",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "uploadDate",
        "label": "Upload date",
        "kind": "datetime",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "studioId",
        "label": "Studio",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "StudioInfo"
      }
    ]
  },
  "Notification": {
    "name": "Notification",
    "delegate": "notification",
    "label": "Notificações",
    "idField": "id",
    "idKind": "string",
    "labelField": "message",
    "select": {
      "id": true,
      "message": true,
      "read": true,
      "userId": true
    },
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "kind": "text",
        "optional": false,
        "required": false,
        "writable": false,
        "hidden": true
      },
      {
        "name": "message",
        "label": "Message",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false
      },
      {
        "name": "read",
        "label": "Read",
        "kind": "bool",
        "optional": false,
        "required": false,
        "writable": true,
        "hidden": false,
        "defaultBool": false
      },
      {
        "name": "userId",
        "label": "User",
        "kind": "text",
        "optional": false,
        "required": true,
        "writable": true,
        "hidden": false,
        "relation": "User"
      }
    ]
  }
};
