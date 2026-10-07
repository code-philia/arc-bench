// Public deterministic business world; application initialization is evaluator-owned.
export const BENCHMARK_NOW = "2026-07-19T08:00:00+08:00";
export const IDS = ["110101199001011237", "110101199001021232", "110101199001031238"];
export const ACCOUNTS: Record<string, { email?: string; password?: string; mobile?: string; [key: string]: unknown }> = {
  "user": {
    "email": "ctrip_user@example.com",
    "password": "Travel1234",
    "username": "ctrip_user",
    "mobile": "13800000010"
  },
  "order_read": {
    "email": "ctrip_order_read@example.com",
    "password": "Travel1234"
  },
  "order_cancel": {
    "email": "ctrip_order_cancel@example.com",
    "password": "Travel1234"
  },
  "personal_read": {
    "email": "ctrip_personal_read@example.com",
    "password": "Travel1234"
  },
  "traveler_create": {
    "email": "ctrip_traveler_create@example.com",
    "password": "Travel1234",
    "mobile": "13800000024"
  },
  "traveler_delete": {
    "email": "ctrip_traveler_delete@example.com",
    "password": "Travel1234"
  },
  "traveler_batch": {
    "email": "ctrip_traveler_batch@example.com",
    "password": "Travel1234"
  },
  "address_create": {
    "email": "ctrip_address_create@example.com",
    "password": "Travel1234"
  },
  "address_delete": {
    "email": "ctrip_address_delete@example.com",
    "password": "Travel1234"
  },
  "address_batch": {
    "email": "ctrip_address_batch@example.com",
    "password": "Travel1234"
  },
  "contact_search": {
    "email": "ctrip_contact_search@example.com",
    "password": "Travel1234"
  },
  "contact_batch_1": {
    "email": "ctrip_contact_batch_1@example.com",
    "password": "Travel1234"
  },
  "contact_create": {
    "email": "ctrip_contact_create@example.com",
    "password": "Travel1234"
  },
  "contact_delete": {
    "email": "ctrip_contact_delete@example.com",
    "password": "Travel1234"
  },
  "contact_batch_2": {
    "email": "ctrip_contact_batch_2@example.com",
    "password": "Travel1234"
  },
  "invoice_search": {
    "email": "ctrip_invoice_search@example.com",
    "password": "Travel1234"
  },
  "invoice_create": {
    "email": "ctrip_invoice_create@example.com",
    "password": "Travel1234",
    "mobile": "13800000036"
  },
  "invoice_vat": {
    "email": "ctrip_invoice_vat@example.com",
    "password": "Travel1234"
  },
  "invoice_delete": {
    "email": "ctrip_invoice_delete@example.com",
    "password": "Travel1234"
  },
  "invoice_batch": {
    "email": "ctrip_invoice_batch@example.com",
    "password": "Travel1234"
  },
  "profile_read": {
    "email": "ctrip_profile_read@example.com",
    "password": "Travel1234",
    "mobile": "13800000013",
    "nickname": "Profile Reader",
    "real_name": "Li Ming",
    "gender": "Male",
    "birth_date": "1990-01-01"
  },
  "profile_edit": {
    "email": "ctrip_profile_edit@example.com",
    "password": "Travel1234"
  },
  "password_change": {
    "email": "ctrip_password_change@example.com",
    "password": "Travel1234"
  },
  "phone_binding": {
    "email": "ctrip_phone_binding@example.com",
    "password": "Travel1234",
    "mobile": "13800000018"
  },
  "email_binding": {
    "email": "ctrip_email_binding@example.com",
    "password": "Travel1234"
  },
  "status_history_use": {
    "email": "ctrip_status_history_use@example.com",
    "password": "Travel1234"
  },
  "status_history_clear": {
    "email": "ctrip_status_history_clear@example.com",
    "password": "Travel1234"
  },
  "voucher_read": {
    "email": "ctrip_voucher_read@example.com",
    "password": "Travel1234"
  },
  "voucher_pending": {
    "email": "ctrip_voucher_pending@example.com",
    "password": "Travel1234"
  },
  "voucher_history": {
    "email": "ctrip_voucher_history@example.com",
    "password": "Travel1234"
  },
  "13800000011": {
    "mobile": "13800000011",
    "verification_code": "123456"
  },
  "13800000041": {
    "mobile": "13800000041",
    "verification_code": "123456"
  },
  "13800000042": {
    "mobile": "13800000042",
    "verification_code": "123456"
  },
  "13800000043": {
    "mobile": "13800000043",
    "verification_code": "123456"
  },
  "history_isolation": {
    "email": "ctrip_history_isolation@example.com",
    "password": "Travel1234"
  },
  "traveler_edit": {
    "email": "ctrip_traveler_edit@example.com",
    "password": "Travel1234"
  },
  "address_detail": {
    "email": "ctrip_address_detail@example.com",
    "password": "Travel1234"
  },
  "traveler_search_created": {
    "email": "ctrip_traveler_search_created@example.com",
    "password": "Travel1234"
  },
  "traveler_decline": {
    "email": "ctrip_traveler_decline@example.com",
    "password": "Travel1234"
  },
  "status_route_history": {
    "email": "ctrip_status_route_history@example.com",
    "password": "Travel1234"
  }
};
export const SEED_WORLD = [
  {
    "id": "DATA-ACCOUNTS",
    "lifecycle": "SEED",
    "entity": "existing verified accounts",
    "properties": {
      "user": {
        "email": "ctrip_user@example.com",
        "password": "Travel1234",
        "username": "ctrip_user",
        "mobile": "13800000010"
      },
      "order_read": {
        "email": "ctrip_order_read@example.com",
        "password": "Travel1234"
      },
      "order_cancel": {
        "email": "ctrip_order_cancel@example.com",
        "password": "Travel1234"
      },
      "personal_read": {
        "email": "ctrip_personal_read@example.com",
        "password": "Travel1234"
      },
      "traveler_create": {
        "email": "ctrip_traveler_create@example.com",
        "password": "Travel1234",
        "mobile": "13800000024"
      },
      "traveler_delete": {
        "email": "ctrip_traveler_delete@example.com",
        "password": "Travel1234"
      },
      "traveler_batch": {
        "email": "ctrip_traveler_batch@example.com",
        "password": "Travel1234"
      },
      "address_create": {
        "email": "ctrip_address_create@example.com",
        "password": "Travel1234"
      },
      "address_delete": {
        "email": "ctrip_address_delete@example.com",
        "password": "Travel1234"
      },
      "address_batch": {
        "email": "ctrip_address_batch@example.com",
        "password": "Travel1234"
      },
      "contact_search": {
        "email": "ctrip_contact_search@example.com",
        "password": "Travel1234"
      },
      "contact_batch_1": {
        "email": "ctrip_contact_batch_1@example.com",
        "password": "Travel1234"
      },
      "contact_create": {
        "email": "ctrip_contact_create@example.com",
        "password": "Travel1234"
      },
      "contact_delete": {
        "email": "ctrip_contact_delete@example.com",
        "password": "Travel1234"
      },
      "contact_batch_2": {
        "email": "ctrip_contact_batch_2@example.com",
        "password": "Travel1234"
      },
      "invoice_search": {
        "email": "ctrip_invoice_search@example.com",
        "password": "Travel1234"
      },
      "invoice_create": {
        "email": "ctrip_invoice_create@example.com",
        "password": "Travel1234",
        "mobile": "13800000036"
      },
      "invoice_vat": {
        "email": "ctrip_invoice_vat@example.com",
        "password": "Travel1234"
      },
      "invoice_delete": {
        "email": "ctrip_invoice_delete@example.com",
        "password": "Travel1234"
      },
      "invoice_batch": {
        "email": "ctrip_invoice_batch@example.com",
        "password": "Travel1234"
      },
      "profile_read": {
        "email": "ctrip_profile_read@example.com",
        "password": "Travel1234",
        "mobile": "13800000013",
        "nickname": "Profile Reader",
        "real_name": "Li Ming",
        "gender": "Male",
        "birth_date": "1990-01-01"
      },
      "profile_edit": {
        "email": "ctrip_profile_edit@example.com",
        "password": "Travel1234"
      },
      "password_change": {
        "email": "ctrip_password_change@example.com",
        "password": "Travel1234"
      },
      "phone_binding": {
        "email": "ctrip_phone_binding@example.com",
        "password": "Travel1234",
        "mobile": "13800000018"
      },
      "email_binding": {
        "email": "ctrip_email_binding@example.com",
        "password": "Travel1234"
      },
      "status_history_use": {
        "email": "ctrip_status_history_use@example.com",
        "password": "Travel1234"
      },
      "status_history_clear": {
        "email": "ctrip_status_history_clear@example.com",
        "password": "Travel1234"
      },
      "voucher_read": {
        "email": "ctrip_voucher_read@example.com",
        "password": "Travel1234"
      },
      "voucher_pending": {
        "email": "ctrip_voucher_pending@example.com",
        "password": "Travel1234"
      },
      "voucher_history": {
        "email": "ctrip_voucher_history@example.com",
        "password": "Travel1234"
      },
      "13800000011": {
        "mobile": "13800000011",
        "verification_code": "123456"
      },
      "13800000041": {
        "mobile": "13800000041",
        "verification_code": "123456"
      },
      "13800000042": {
        "mobile": "13800000042",
        "verification_code": "123456"
      },
      "13800000043": {
        "mobile": "13800000043",
        "verification_code": "123456"
      },
      "history_isolation": {
        "email": "ctrip_history_isolation@example.com",
        "password": "Travel1234"
      },
      "traveler_edit": {
        "email": "ctrip_traveler_edit@example.com",
        "password": "Travel1234"
      },
      "address_detail": {
        "email": "ctrip_address_detail@example.com",
        "password": "Travel1234"
      },
      "traveler_search_created": {
        "email": "ctrip_traveler_search_created@example.com",
        "password": "Travel1234"
      },
      "traveler_decline": {
        "email": "ctrip_traveler_decline@example.com",
        "password": "Travel1234"
      },
      "status_route_history": {
        "email": "ctrip_status_route_history@example.com",
        "password": "Travel1234"
      }
    },
    "description": "Email/username provisioning and final email binding are not defined as in-scope creation flows. Initialize these existing accounts; registration accounts are instead CREATED. Accounts dedicated to create/delete start with empty relevant lists. History-use/clear accounts start with no status history; tests create history through search. profile_read has no orders, vouchers or status history. history_isolation is a separate verified owner for account-isolation queries; its history starts empty. Extension-only mutation owners traveler_edit, address_detail, traveler_search_created and traveler_decline start with empty corresponding lists; status_route_history starts with empty status history. Their UI setup never changes original create/read owners."
  },
  {
    "id": "DATA-SMS",
    "lifecycle": "SEED",
    "entity": "simulated verification delivery",
    "properties": {
      "country_code": "+86",
      "code": "123456",
      "registration_phone_rule": "139 + SHA-256(CTRIP_RUN_ID + worker index + test title) interpreted as integer modulo 100000000, padded to 8 digits; evaluator must ensure scenario phone values are unique within the run."
    },
    "description": "Code becomes valid after Send code. Source 13800000044..47 are example new phones, replaced by deterministic isolated phones; never pre-create their accounts."
  },
  {
    "id": "DATA-FLIGHTS",
    "lifecycle": "SEED",
    "entity": "published booking inventory",
    "properties": {
      "flights": [
        {
          "number": "CZ3401",
          "origin": "Chengdu",
          "destination": "Guangzhou",
          "date": "2026-07-21",
          "airline": "China Southern",
          "stops": "nonstop",
          "fare": 320,
          "departure": "11:00",
          "on_time": "95%"
        },
        {
          "number": "JD5162",
          "origin": "Chengdu",
          "destination": "Guangzhou",
          "date": "2026-07-21",
          "airline": "Other airline",
          "stops": "stopover",
          "fare": 460,
          "departure": "09:00",
          "on_time": "88%"
        },
        {
          "number": "MU5234",
          "origin": "Chengdu",
          "destination": "Guangzhou",
          "date": "2026-07-21",
          "airline": "Other airline",
          "stops": "nonstop",
          "fare": 580,
          "departure": "07:30",
          "on_time": "91%"
        },
        {
          "number": "CZ3401",
          "origin": "Chengdu",
          "destination": "Guangzhou",
          "date": "2026-07-22",
          "airline": "China Southern",
          "fare": 320,
          "taxes": 70
        }
      ],
      "empty_query": {
        "origin": "Beihai",
        "destination": "Mars City",
        "date": "2026-07-23"
      },
      "calendar_fare": {
        "2026-07-21": 460,
        "2026-07-22": 320
      },
      "next_week": "2026-07-28",
      "jd5162": {
        "taxes_per_passenger": 70,
        "baggage_kg": 20,
        "insurance": 40,
        "extra_10kg": 60,
        "drop_off": 42,
        "lounge": 80,
        "refund_fee": 100
      }
    },
    "description": "Flight identity includes route, date and dataset. The source booking MU5234 and status MU5234 describe different route records; do not merge them by flight number alone."
  },
  {
    "id": "DATA-CITIES",
    "lifecycle": "SEED",
    "entity": "city directory",
    "properties": {
      "Chengdu": {
        "code": "CTU",
        "group": "Popular"
      },
      "Guangzhou": {
        "code": "CAN",
        "group": "GHIJ"
      },
      "other_cities": [
        "Shanghai",
        "Beijing"
      ]
    }
  },
  {
    "id": "DATA-BOOKING-HISTORY",
    "lifecycle": "SEED",
    "entity": "initial anonymous search history",
    "properties": {
      "name": "Chengdu - Guangzhou",
      "origin": "Chengdu",
      "destination": "Guangzhou",
      "date": "2026-07-21"
    },
    "description": "The explicit anonymous homepage history is an initial browsing fixture, not a registered account."
  },
  {
    "id": "DATA-PERSONAL-READ",
    "lifecycle": "SEED",
    "entity": "immutable legacy personal records",
    "properties": {
      "personal_read": {
        "travelers": [
          {
            "name": "Li Si"
          }
        ],
        "addresses": [
          {
            "recipient": "Zhang San",
            "city": "Shanghai",
            "district": "Pudong New Area",
            "street": "No. 100 Century Avenue"
          }
        ]
      },
      "contact_search": {
        "contacts": [
          {
            "name": "Zhang San"
          }
        ]
      },
      "invoice_search": {
        "invoice_titles": [
          {
            "name": "Shanghai Example Technology Co., Ltd.",
            "taxpayer_id": "91310000123456789A",
            "type": "Company"
          }
        ]
      },
      "user": {
        "travelers": [
          {
            "name": "Zhang San"
          },
          {
            "name": "Li Si"
          }
        ]
      }
    },
    "description": "Read-only legacy examples remain seed records; their creation is not the behavior under test. New deletion records are UI-created on their independent owners."
  },
  {
    "id": "DATA-ORDERS",
    "lifecycle": "SEED",
    "entity": "historical and cancellation orders",
    "properties": [
      {
        "owner": "order_read",
        "number": "CTRIP20260721001",
        "flight": "JD5162",
        "date": "2026-07-21",
        "origin": "Chengdu",
        "destination": "Guangzhou",
        "total": 530,
        "payment_status": "Pending payment",
        "display_status": "Pending payment"
      },
      {
        "owner": "order_read",
        "number": "CTRIP20260722002",
        "flight": "CZ3401",
        "date": "2026-07-22",
        "total": 390,
        "payment_status": "Paid",
        "display_status": "Not traveled"
      },
      {
        "owner": "order_read",
        "number": "CTRIP20260718003",
        "flight": "MU5234",
        "date": "2026-07-18",
        "total": 650,
        "payment_status": "Paid",
        "display_status": "Pending review"
      },
      {
        "owner": "order_cancel",
        "number": "CTRIP20260721004",
        "flight": "JD5162",
        "date": "2026-07-21",
        "total": 530,
        "payment_status": "Pending payment",
        "display_status": "Pending payment"
      }
    ],
    "description": "Booking/payment flows cannot backdate paid/completed/pending-review history. Initialize legacy orders separately from new UI submissions. Pending-order timers have sufficient positive remaining time at run start, with a payment-expiry reminder; no exact timeout is specified."
  },
  {
    "id": "DATA-STATUS",
    "lifecycle": "SEED",
    "entity": "flight status observations",
    "properties": [
      {
        "number": "JD5162",
        "date": "2026-07-21",
        "origin": "Chengdu",
        "destination": "Guangzhou",
        "status": "Scheduled",
        "check_in": "H14-H25",
        "gate": "B12",
        "carousel": "6"
      },
      {
        "number": "MU5234",
        "date": "2026-07-21",
        "origin": "Shanghai",
        "destination": "Beijing",
        "airline": "China Eastern",
        "departure": "09:00",
        "arrival": "11:30",
        "status": "Scheduled"
      }
    ]
  },
  {
    "id": "DATA-VOUCHERS",
    "lifecycle": "SEED",
    "entity": "voucher eligibility and issued history",
    "properties": [
      {
        "owner": "voucher_read",
        "order": "CTRIP20260718004",
        "date": "2026-07-18",
        "payment_status": "Paid",
        "travel_status": "Completed",
        "voucher_status": "Completed"
      },
      {
        "owner": "voucher_pending",
        "order": "CTRIP20260721005",
        "payment_date": "2026-07-19",
        "payment_status": "Paid",
        "voucher_status": "None"
      },
      {
        "owner": "voucher_history",
        "order": "CTRIP20260514001",
        "date": "2026-05-14",
        "payment_date": "2026-05-14",
        "payment_status": "Paid",
        "travel_status": "Completed",
        "voucher_status": "None"
      }
    ]
  },
  {
    "id": "DATA-AIRPORTS",
    "lifecycle": "SEED",
    "entity": "airport guide and deterministic weather",
    "properties": {
      "popular": [
        "Beijing Capital Airport",
        "Shanghai Pudong Airport",
        "Guangzhou Baiyun Airport"
      ],
      "domestic_C": [
        "Chengdu",
        "Chongqing",
        "Changchun"
      ],
      "international": [
        "Hong Kong International Airport"
      ],
      "weather": {
        "city": "Beijing",
        "range": "-5°C to 3°C"
      },
      "beijing_capital": {
        "location": "Beijing",
        "runways": "3 runways",
        "overview": "China's first national gateway",
        "bus": {
          "name": "Fangzhuang line",
          "stop": "Fangzhuang",
          "first": "06:00",
          "last": "21:00",
          "headway": "30 minutes"
        },
        "medical_first_aid": "010-64541100"
      }
    },
    "description": "Weather is a supplied snapshot from the source, not a live meteorological fetch; independent of the July clock."
  },
  {
    "id": "DATA-IDENTITIES",
    "lifecycle": "SEED",
    "entity": "accepted test identity inputs",
    "properties": {
      "ids": [
        "110101199001011237",
        "110101199001021232",
        "110101199001031238"
      ]
    },
    "description": "Validation examples, not saved travelers; valid checksum mainland IDs used by UI setup."
  }
] as const;
