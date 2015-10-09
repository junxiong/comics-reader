import Store from './store'

/**
  Schema Comic {
    title: String,
    code: String
    author: String,
    description: String,
    coverImage: String,
    parts: [Part]
  }

  Schema Part {
    title: String,
    author: String,
    coverImage: String,
    volumns: [Volumn]
  }

  Schema Volumn {
    title: String,
    author: String,
    coverImage: String,
    screens: [String]
  }
*/
export const Comic = Store('comics')

/**
  Schema History {
    comic: String,
    partNo: Int,
    volumnNo: Int,
    screenNo: Int
  }
*/
export const History = Store('histories')
