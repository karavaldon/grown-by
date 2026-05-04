import { useState, useEffect, useRef } from 'react'
import {
  CalendarIcon, MapMarkerIcon, ChevronDown, ChevronRight,
  ArrowLeft, TrendUp, TrendDown, SortIcon, CheckIcon,
} from './icons/index.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function fmtNum(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

const PRODUCT_INSIGHTS = {
  'Today':
    'Tomatoes are outselling everything else today — 230 units and climbing. Ground Beef has the highest revenue per unit. Consider featuring both at the front of your table.',
  'Yesterday':
    'Your top 3 products — Tomatoes, Ground Beef, and Apples — made up 58% of gross sales. Cucumbers moved slowly; only 12 units sold all day.',
  'Last 7 Days':
    'Ground Beef generated the most revenue this week despite low unit volume — your highest-margin item. Vegetables as a category led in quantity. Butter and Cream Cheese are underperforming; consider bundling.',
  'Last 30 Days':
    'Tomatoes and Ground Beef have been your consistent top earners all month. Dairy is your fastest-growing category by margin — worth expanding. Week 3 saw a spike in Fruit sales, likely weather-driven.',
  'Last 3 Months':
    'Dairy grew 22% in gross sales over the period — your biggest category mover. Ground Beef holds the highest net margin. Cucumbers and Parsnips are your slowest movers; consider rotating them out seasonally.',
  'Last Year':
    'Tomatoes drove more annual revenue than any other single product. Summer months spiked Fruit and Vegetable sales significantly. Meats performed steadily year-round — your most reliable category by consistency.',
}

const AI_INSIGHTS = {
  'Today':
    'Tomatoes are your #1 seller today with 230 units moved. Your 12pm hour is your peak — consider having extra staff ready. Saturday momentum is strong; you\'re on pace for your best week this month.',
  'Yesterday':
    'Sales dipped 3% vs the day before, mainly in the morning window. Your afternoon rebound was solid. Ground Beef and Tomatoes held steady — lean into those for today\'s market.',
  'Last 7 Days':
    'This week is up 12% vs last week. Saturday drove nearly a quarter of total sales. Tomatoes and Ground Beef are your top revenue items — both are selling faster than you\'re restocking them.',
  'Last 30 Days':
    'Strong month — up 7% vs last month. Week 3 was your peak. New customers are up 18%, a sign your Saturday presence is paying off. Stock up on Tomatoes and Apples heading into next month.',
  'Last 3 Months':
    'Revenue is up 14% over the prior period. New customer growth is outpacing returning customers — your visibility is expanding. Consider adding more Dairy variety; that category is growing fastest by margin.',
  'Last Year':
    'Your best months were July–September, accounting for 37% of annual revenue. Year-over-year growth of 18% puts you among the top performers on GrownBy. Expanding your catalog ahead of summer could amplify that peak further.',
}

function AiCallout({ dateFilter }) {
  return (
    <div style={{
      background: '#EDE9FC', borderRadius: 10,
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 16px 12px 12px',
      border: '1px solid #5E44C5',
      boxShadow: '0 6px 24px 0px rgba(94, 68, 197, 0.10)',
    }}>
      <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 3 }}>💡</span>
      <span style={{ fontSize: 16, color: 'black', lineHeight: '24px' }}>
        {AI_INSIGHTS[dateFilter]}
      </span>
    </div>
  )
}

// ─── Date-range Data ──────────────────────────────────────────────────────────

const DATE_CONFIG = {
  'Today': {
    periodLabel: 'today',
    currentLabel: 'Today',
    priorLabel: 'Yesterday',
    compareLabel: 'Compare yesterday',
    barLabels: ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm'],
    sales:     { gross: 1845.30,   net: 1023.80,   compText: 'Up 8% vs yesterday',     positive: true  },
    orders:    { total: 25,        avg: 22.25,      compText: 'Up 8% vs yesterday',     positive: true  },
    customers: { total: 34,        newCust: 23,     returning: 9,  compText: 'Up 12% vs yesterday',    positive: true  },
    invoices:  { total: 140,       count: 2 },
    graph: {
      Sales: {
        fmt: v => fmt(v),
        'All':             { today: [45,36,27,18,180,342,360,324,288,180,90,45],   yesterday: [72,54,45,36,153,288,315,297,252,162,126,72]   },
        'Main Farm Stand': { today: [40,32,24,16,162,310,326,293,261,162,82,40],   yesterday: [64,48,40,32,136,256,281,266,225,144,112,64]   },
        'Downtown Market': { today: [2,2,1,1,10,18,20,18,15,9,5,2],               yesterday: [4,3,2,2,9,17,19,17,13,8,7,4]                  },
        'Online Store':    { today: [4,3,2,1,9,16,16,15,13,10,5,3],               yesterday: [5,3,3,2,8,17,17,16,14,10,8,5]                  },
      },
      Orders: {
        fmt: v => Math.round(v)+' orders',
        'All':             { today: [2,2,1,1,8,15,16,14,13,8,4,2],   yesterday: [3,2,2,2,7,13,14,13,11,7,6,3]   },
        'Main Farm Stand': { today: [2,2,1,1,7,13,14,13,12,7,3,2],   yesterday: [3,2,2,2,6,12,13,11,10,6,5,3]   },
        'Downtown Market': { today: [0,0,0,1,3,5,6,4,2,1,0,0],       yesterday: [0,0,0,1,2,4,5,4,2,1,0,0]       },
        'Online Store':    { today: [1,1,0,0,2,3,2,2,2,2,1,1],       yesterday: [1,0,0,0,1,2,2,2,2,1,1,1]       },
      },
      Customers: {
        fmt: v => Math.round(v)+' cust.',
        'All':             { today: [3,3,1,1,5,9,10,9,8,5,4,3],   yesterday: [4,3,3,1,4,8,9,8,7,4,4,3]   },
        'Main Farm Stand': { today: [2,2,1,1,4,8,9,8,7,4,3,2],    yesterday: [3,3,2,1,3,7,8,7,6,4,4,3]   },
        'Downtown Market': { today: [0,0,0,1,3,4,5,3,2,1,0,0],    yesterday: [0,0,0,1,2,3,4,3,2,1,0,0]   },
        'Online Store':    { today: [1,1,1,0,2,3,3,2,2,2,1,1],    yesterday: [1,1,0,0,2,2,3,2,2,1,1,1]   },
      },
    },
    locations: [
      { name:'Main Farm Stand',  label:'at Main Farm Stand',  sales:1675.65, salesPct:+2,   orders:14, orderPct:+8,   customers:23, newCust:16, returning:4,  invoices:0   },
      { name:'Downtown Market', label:'at Downtown Market', sales:95.30,   salesPct:null, orders:3,  orderPct:null, customers:3,  newCust:0,  returning:3,  invoices:140, invoiceCount:2 },
      { name:'Online Store', label:'Online Store',        sales:65.34,   salesPct:-4,   orders:2,  orderPct:-4,   customers:6,  newCust:2,  returning:4,  invoices:0   },
    ],
    productMult: 1,
  },
  'Yesterday': {
    periodLabel: 'yesterday',
    currentLabel: 'Yesterday',
    priorLabel: 'Day before',
    compareLabel: 'Compare day before',
    barLabels: ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm'],
    sales:     { gross: 1702.40,   net: 945.30,    compText: 'Down 3% vs day before',  positive: false },
    orders:    { total: 23,        avg: 20.80,      compText: 'Down 3% vs day before',  positive: false },
    customers: { total: 30,        newCust: 18,     returning: 11, compText: 'Down 5% vs day before',   positive: false },
    invoices:  { total: 0,         count: 0 },
    graph: {
      Sales: {
        fmt: v => fmt(v),
        'All':             { today: [72,54,45,36,153,288,315,297,252,162,126,72],   yesterday: [63,50,40,32,162,306,324,306,270,171,117,68]   },
        'Main Farm Stand': { today: [64,48,40,32,136,257,280,265,225,144,112,64],   yesterday: [55,44,35,28,143,269,285,270,238,151,103,60]   },
        'Downtown Market': { today: [4,3,3,2,9,17,19,18,15,10,8,4],               yesterday: [3,3,2,2,9,17,18,17,15,9,6,4]                  },
        'Online Store':    { today: [5,4,3,2,9,15,17,15,13,9,7,5],               yesterday: [5,3,3,2,10,21,22,20,18,12,8,4]                },
      },
      Orders: {
        fmt: v => Math.round(v)+' orders',
        'All':             { today: [3,2,2,2,7,13,14,13,11,7,6,3],   yesterday: [3,2,2,1,6,12,13,12,11,7,4,3]   },
        'Main Farm Stand': { today: [3,2,2,1,6,12,12,12,10,6,5,3],   yesterday: [2,2,1,1,5,11,12,11,10,6,4,2]   },
        'Downtown Market': { today: [0,0,0,1,2,4,5,4,2,1,0,0],       yesterday: [0,0,0,1,2,4,5,3,2,1,0,0]       },
        'Online Store':    { today: [1,0,0,0,2,3,3,2,2,1,1,1],       yesterday: [1,1,0,0,1,2,2,2,2,1,1,0]       },
      },
      Customers: {
        fmt: v => Math.round(v)+' cust.',
        'All':             { today: [4,3,3,1,4,8,9,8,7,4,4,3],   yesterday: [3,3,2,1,5,9,10,9,8,5,4,3]   },
        'Main Farm Stand': { today: [4,3,2,1,4,7,8,7,6,4,3,2],   yesterday: [3,2,2,1,4,8,9,8,7,5,4,2]   },
        'Downtown Market': { today: [0,0,0,1,2,3,4,3,2,1,0,0],   yesterday: [0,0,0,1,1,3,4,3,2,1,0,0]   },
        'Online Store':    { today: [1,0,0,0,1,2,2,2,2,1,1,1],   yesterday: [1,1,0,0,1,2,3,2,2,1,1,0]   },
      },
    },
    locations: [
      { name:'Main Farm Stand',  label:'at Main Farm Stand',  sales:1540.20, salesPct:-3,   orders:12, orderPct:-3,   customers:20, newCust:14, returning:6, invoices:0 },
      { name:'Downtown Market', label:'at Downtown Market', sales:102.40,  salesPct:null, orders:4,  orderPct:null, customers:4,  newCust:1,  returning:3, invoices:0 },
      { name:'Online Store', label:'Online Store',        sales:59.80,   salesPct:-4,   orders:2,  orderPct:-4,   customers:5,  newCust:2,  returning:3, invoices:0 },
    ],
    productMult: 0.92,
  },
  'Last 7 Days': {
    periodLabel: 'this week',
    currentLabel: 'This week',
    priorLabel: 'Prior week',
    compareLabel: 'Compare prior week',
    barLabels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    sales:     { gross: 12480.50,  net: 6930.20,   compText: 'Up 12% vs prior week',   positive: true  },
    orders:    { total: 168,       avg: 21.40,      compText: 'Up 12% vs prior week',   positive: true  },
    customers: { total: 214,       newCust: 145,    returning: 69,  compText: 'Up 9% vs prior week',    positive: true  },
    invoices:  { total: 420,       count: 6 },
    graph: {
      Sales: {
        fmt: v => fmt(v),
        'All':             { today: [1420,1680,1840,1260,2205,2940,2048],   yesterday: [1268,1554,1628,1155,2048,2730,1869]   },
        'Main Farm Stand': { today: [1278,1512,1656,1134,1985,2673,1862],   yesterday: [1141,1399,1465,1040,1843,2457,1682]   },
        'Downtown Market': { today: [18,24,30,14,52,220,168],              yesterday: [16,20,26,12,44,198,148]              },
        'Online Store':    { today: [196,154,128,96,148,182,128],          yesterday: [172,136,112,84,130,162,112]           },
      },
      Orders: {
        fmt: v => Math.round(v)+' orders',
        'All':             { today: [20,24,26,18,32,42,28],   yesterday: [18,22,23,16,30,38,25]   },
        'Main Farm Stand': { today: [18,22,23,16,29,38,25],   yesterday: [16,20,21,14,27,34,23]   },
        'Downtown Market': { today: [1,1,2,1,3,14,10],        yesterday: [1,1,1,1,2,12,9]         },
        'Online Store':    { today: [4,3,2,1,3,4,2],          yesterday: [3,3,2,1,2,3,2]          },
      },
      Customers: {
        fmt: v => Math.round(v)+' cust.',
        'All':             { today: [28,32,35,24,40,54,36],   yesterday: [25,29,32,21,36,48,32]   },
        'Main Farm Stand': { today: [25,29,32,22,36,49,33],   yesterday: [22,26,29,19,32,43,29]   },
        'Downtown Market': { today: [2,2,3,1,4,18,14],        yesterday: [1,2,2,1,3,16,12]        },
        'Online Store':    { today: [7,5,4,3,5,7,4],          yesterday: [6,4,3,2,4,6,3]          },
      },
    },
    locations: [
      { name:'Main Farm Stand',  label:'at Main Farm Stand',  sales:11254.40, salesPct:+12, orders:98,  orderPct:+15, customers:124, newCust:88,  returning:36, invoices:0   },
      { name:'Downtown Market', label:'at Downtown Market', sales:728.10,   salesPct:null, orders:24, orderPct:null, customers:28,  newCust:8,   returning:20, invoices:420, invoiceCount:6 },
      { name:'Online Store', label:'Online Store',        sales:498.00,   salesPct:+6,  orders:14,  orderPct:+6,  customers:46,  newCust:32,  returning:14, invoices:0   },
    ],
    productMult: 6.5,
  },
  'Last 30 Days': {
    periodLabel: 'this month',
    currentLabel: 'This month',
    priorLabel: 'Prior month',
    compareLabel: 'Compare prior month',
    barLabels: ['Week 1','Week 2','Week 3','Week 4'],
    sales:     { gross: 52640.80,  net: 29220.40,  compText: 'Up 7% vs prior month',   positive: true  },
    orders:    { total: 712,       avg: 20.90,      compText: 'Up 7% vs prior month',   positive: true  },
    customers: { total: 890,       newCust: 580,    returning: 310, compText: 'Up 5% vs prior month',   positive: true  },
    invoices:  { total: 1680,      count: 22 },
    graph: {
      Sales: {
        fmt: v => fmt(v),
        'All':             { today: [12100,14175,15540,13020],   yesterday: [11312,13244,14531,12170]   },
        'Main Farm Stand': { today: [10890,12757,13986,11718],   yesterday: [10181,11920,13078,10953]   },
        'Downtown Market': { today: [680,1040,1180,762],          yesterday: [620,960,1090,704]           },
        'Online Store':    { today: [380,528,612,396],           yesterday: [348,490,570,368]           },
      },
      Orders: {
        fmt: v => Math.round(v)+' orders',
        'All':             { today: [165,195,215,180],   yesterday: [154,182,201,168]   },
        'Main Farm Stand': { today: [148,176,193,162],   yesterday: [138,164,181,151]   },
        'Downtown Market': { today: [10,15,17,11],       yesterday: [9,14,15,10]        },
        'Online Store':    { today: [6,9,11,6],          yesterday: [5,8,10,6]          },
      },
      Customers: {
        fmt: v => Math.round(v)+' cust.',
        'All':             { today: [210,250,275,228],   yesterday: [196,234,257,213]   },
        'Main Farm Stand': { today: [189,225,248,205],   yesterday: [176,211,232,192]   },
        'Downtown Market': { today: [12,20,22,14],       yesterday: [11,18,20,13]       },
        'Online Store':    { today: [22,34,38,24],       yesterday: [20,30,35,22]       },
      },
    },
    locations: [
      { name:'Main Farm Stand',  label:'at Main Farm Stand',  sales:47376.72, salesPct:+7,  orders:416, orderPct:+9,  customers:524, newCust:356, returning:168, invoices:0    },
      { name:'Downtown Market', label:'at Downtown Market', sales:3065.76,  salesPct:null, orders:102, orderPct:null, customers:118, newCust:38,  returning:80,  invoices:1680, invoiceCount:22 },
      { name:'Online Store', label:'Online Store',        sales:2198.32,  salesPct:+4,  orders:58,  orderPct:+4,  customers:192, newCust:136, returning:56,  invoices:0    },
    ],
    productMult: 28,
  },
  'Last 3 Months': {
    periodLabel: 'last 3 months',
    currentLabel: 'This period',
    priorLabel: 'Prior period',
    compareLabel: 'Compare prior period',
    barLabels: ['Feb','Mar','Apr'],
    sales:     { gross: 158400.00, net: 87920.00,  compText: 'Up 14% vs prior period', positive: true  },
    orders:    { total: 2142,      avg: 21.10,      compText: 'Up 14% vs prior period', positive: true  },
    customers: { total: 2680,      newCust: 1740,   returning: 940, compText: 'Up 11% vs prior period', positive: true  },
    invoices:  { total: 5040,      count: 65 },
    graph: {
      Sales: {
        fmt: v => fmt(v),
        'All':             { today: [48400,57200,63800],   yesterday: [42443,50175,55965]   },
        'Main Farm Stand': { today: [43560,51480,57420],   yesterday: [38199,45158,50369]   },
        'Downtown Market': { today: [2420,3640,4180],      yesterday: [2120,3180,3660]      },
        'Online Store':    { today: [1680,2640,3200],      yesterday: [1470,2310,2800]      },
      },
      Orders: {
        fmt: v => fmtNum(v)+' orders',
        'All':             { today: [648,728,800],   yesterday: [568,638,700]   },
        'Main Farm Stand': { today: [583,655,720],   yesterday: [511,574,630]   },
        'Downtown Market': { today: [36,54,62],      yesterday: [32,47,54]      },
        'Online Store':    { today: [22,36,44],      yesterday: [19,31,38]      },
      },
      Customers: {
        fmt: v => fmtNum(v)+' cust.',
        'All':             { today: [800,900,1020],   yesterday: [721,811,919]   },
        'Main Farm Stand': { today: [720,810,918],    yesterday: [649,730,827]   },
        'Downtown Market': { today: [46,68,80],       yesterday: [41,60,70]      },
        'Online Store':    { today: [60,88,108],      yesterday: [54,78,94]      },
      },
    },
    locations: [
      { name:'Main Farm Stand',  label:'at Main Farm Stand',  sales:142560.00, salesPct:+14, orders:1248, orderPct:+16, customers:1572, newCust:1068, returning:504, invoices:0    },
      { name:'Downtown Market', label:'at Downtown Market', sales:9216.00,   salesPct:null, orders:305, orderPct:null, customers:354,  newCust:112,  returning:242, invoices:5040, invoiceCount:65 },
      { name:'Online Store', label:'Online Store',        sales:6624.00,   salesPct:+8,  orders:174, orderPct:+8,  customers:576,  newCust:408,  returning:168, invoices:0    },
    ],
    productMult: 85,
  },
  'Last Year': {
    periodLabel: 'this year',
    currentLabel: 'This year',
    priorLabel: 'Prior year',
    compareLabel: 'Compare prior year',
    barLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    sales:     { gross: 624000.00, net: 346440.00, compText: 'Up 18% vs prior year',   positive: true  },
    orders:    { total: 8448,      avg: 21.50,      compText: 'Up 18% vs prior year',   positive: true  },
    customers: { total: 10560,     newCust: 6864,   returning: 3696, compText: 'Up 15% vs prior year',  positive: true  },
    invoices:  { total: 19800,     count: 256 },
    graph: {
      Sales: {
        fmt: v => fmt(v),
        'All':             { today: [38000,44000,62000,78000,92000,110000,115000,118000,96000,72000,56000,44000], yesterday: [32200,37340,52630,66220,78060,93390,97580,100180,81510,61100,47530,37350] },
        'Main Farm Stand': { today: [33820,39160,55180,69420,81880,97900,102350,105020,85440,64080,49840,39160], yesterday: [28336,32859,46314,58274,68693,82183,85870,88158,71729,53768,41826,32868] },
        'Downtown Market': { today: [1900,2200,3410,4680,5520,6490,6900,6962,5760,4032,2800,1900],               yesterday: [1771,2054,2895,3643,4294,5137,5367,5510,4483,3361,2614,2054]             },
        'Online Store':    { today: [1710,1980,2790,3510,4140,4950,5175,5310,4320,3240,2520,2640],               yesterday: [1352,1569,2210,2781,3278,3922,4097,4208,3423,2566,1996,1569]             },
      },
      Orders: {
        fmt: v => fmtNum(v)+' orders',
        'All':             { today: [512,588,832,1044,1232,1474,1540,1580,1286,964,750,590],     yesterday: [434,499,706,886,1045,1251,1307,1341,1091,818,637,501]   },
        'Main Farm Stand': { today: [455,523,740,928,1095,1311,1370,1405,1143,857,667,525],      yesterday: [382,439,621,780,920,1101,1150,1180,960,720,561,441]     },
        'Downtown Market': { today: [31,35,50,63,74,88,92,95,77,58,45,35],                      yesterday: [26,30,42,53,63,75,78,80,65,49,38,30]                   },
        'Online Store':    { today: [26,30,42,53,63,75,78,80,66,49,38,30],                      yesterday: [22,25,35,45,53,63,66,68,55,42,32,25]                   },
      },
      Customers: {
        fmt: v => fmtNum(v)+' cust.',
        'All':             { today: [640,735,1040,1305,1540,1842,1925,1975,1608,1205,938,738],   yesterday: [544,624,883,1108,1308,1564,1634,1677,1366,1024,797,627]   },
        'Main Farm Stand': { today: [569,654,925,1161,1370,1639,1713,1757,1431,1072,835,657],   yesterday: [483,555,786,986,1164,1392,1454,1493,1216,911,709,558]    },
        'Downtown Market': { today: [38,44,62,78,92,111,116,119,97,72,56,44],                   yesterday: [33,37,53,66,78,94,98,101,82,61,48,37]                   },
        'Online Store':    { today: [46,56,79,99,117,140,146,150,122,91,71,56],                 yesterday: [39,47,67,84,99,119,124,127,104,77,60,48]                },
      },
    },
    locations: [
      { name:'Main Farm Stand',  label:'at Main Farm Stand',  sales:561600.00, salesPct:+18, orders:4918, orderPct:+20, customers:6194, newCust:4202, returning:1992, invoices:0     },
      { name:'Downtown Market', label:'at Downtown Market', sales:36288.00,  salesPct:null, orders:1203, orderPct:null, customers:1394, newCust:442, returning:952,  invoices:19800, invoiceCount:256 },
      { name:'Online Store', label:'Online Store',        sales:26112.00,  salesPct:+10, orders:686,  orderPct:+10, customers:2270, newCust:1608, returning:662,  invoices:0     },
    ],
    productMult: 340,
  },
}

const PRODUCTS = [
  { name: 'Tomatoes',       category: 'Vegetables', qty: 230, gross: 679.23, net: 356.78 },
  { name: 'Parsnips',       category: 'Vegetables', qty: 143, gross: 145.67, net:  87.90 },
  { name: 'Cucumbers',      category: 'Vegetables', qty:  12, gross: 122.50, net:  45.90 },
  { name: 'Apples',         category: 'Fruit',      qty:  45, gross: 250.00, net: 150.00 },
  { name: 'Strawberries',   category: 'Fruit',      qty:  28, gross: 140.00, net:  98.00 },
  { name: 'Ground Beef',    category: 'Meats',      qty:   8, gross: 450.45, net: 225.22 },
  { name: 'Chicken Thighs', category: 'Meats',      qty:  15, gross: 210.00, net: 130.00 },
  { name: 'Whole Milk',     category: 'Dairy',      qty:  22, gross:  88.00, net:  55.00 },
  { name: 'Cheddar Cheese', category: 'Dairy',      qty:  10, gross:  75.00, net:  45.00 },
  { name: 'Potatoes',       category: 'Vegetables', qty: 110, gross: 132.00, net:  79.20 },
  { name: 'Blueberries',    category: 'Fruit',      qty:  35, gross: 175.00, net: 105.00 },
  { name: 'Pork Chops',     category: 'Meats',      qty:   7, gross: 145.00, net:  88.00 },
  { name: 'Butter',         category: 'Dairy',      qty:  18, gross:  54.00, net:  36.00 },
  { name: 'Zucchini',       category: 'Vegetables', qty:  60, gross:  90.00, net:  54.00 },
  { name: 'Pears',          category: 'Fruit',      qty:  20, gross:  80.00, net:  50.00 },
  { name: 'Kale',           category: 'Vegetables', qty:  55, gross:  82.50, net:  49.50 },
  { name: 'Peaches',        category: 'Fruit',      qty:  40, gross: 120.00, net:  72.00 },
  { name: 'Lamb Chops',     category: 'Meats',      qty:   5, gross: 175.00, net: 105.00 },
  { name: 'Yogurt',         category: 'Dairy',      qty:  30, gross:  90.00, net:  54.00 },
  { name: 'Bell Peppers',   category: 'Vegetables', qty:  80, gross:  96.00, net:  57.60 },
  { name: 'Grapes',         category: 'Fruit',      qty:  25, gross: 100.00, net:  60.00 },
  { name: 'Bacon',          category: 'Meats',      qty:  12, gross:  96.00, net:  57.60 },
  { name: 'Cream Cheese',   category: 'Dairy',      qty:  15, gross:  60.00, net:  36.00 },
]

const CATEGORIES      = ['All', 'Vegetables', 'Fruit', 'Meats', 'Dairy']
const GRAPH_LOCATIONS = ['All', 'Main Farm Stand', 'Downtown Market', 'Online Store']
const SORT_OPTIONS    = ['Highest sales', 'Lowest sales', 'Most sold', 'Alphabetical']
const DATE_OPTIONS    = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year']

// ─── Small shared components ──────────────────────────────────────────────────

function Divider({ vertical }) {
  return vertical
    ? <div style={{ width: 1, alignSelf: 'stretch', background: '#d9d9d9' }} />
    : <div style={{ height: 1, width: '100%', background: '#d9d9d9' }} />
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 52, padding: '0 14px', borderRadius: 10,
        fontSize: 16, fontWeight: 400, cursor: 'pointer', whiteSpace: 'nowrap',
        border: active ? '1px solid #2d5e3f' : '1px solid #d9d9d9',
        background: active ? '#d3ebc9' : 'white',
        color: active ? '#2d5e3f' : '#231f20',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

function ComparisonTag({ text, positive = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      borderRadius: 16, padding: '2px 8px 4px 10px',
      background: positive ? '#d3ebc9' : '#f0f0f0',
      alignSelf: 'flex-start', flexShrink: 0,
    }}>
      {positive ? <TrendUp /> : <TrendDown color="#606060" />}
      <span style={{ fontSize: 16, color: positive ? '#2d5e3f' : '#606060', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}

function LocationBar({ value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ width: '100%', height: 6, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: '#6dbe4b', borderRadius: 99, transition: 'width 0.4s ease' }} />
    </div>
  )
}

function Dropdown({ options, value, onSelect, onClose, right }) {
  return (
    <div
      className="dropdown-enter"
      style={{
        position: 'absolute', top: 'calc(100% + 4px)',
        [right ? 'right' : 'left']: 0,
        background: 'white', border: '1px solid #d9d9d9',
        borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        zIndex: 50, minWidth: 200, overflow: 'hidden',
      }}
    >
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => { onSelect(opt); onClose() }}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '12px 14px', fontSize: 16, cursor: 'pointer',
            background: opt === value ? '#edf7e8' : 'transparent',
            color: opt === value ? '#6dbe4b' : '#231f20',
            fontWeight: opt === value ? 600 : 400,
            borderBottom: i < options.length - 1 ? '1px solid #f0f0f0' : 'none',
            transition: 'background 0.1s',
            fontFamily: 'Montserrat, sans-serif',
          }}
          onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = '#f8f8f8' }}
          onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent' }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function CardHeader({ title, action, onAction, children }) {
  return (
    <div style={{
      background: '#f0f0f0', height: 44,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', flexShrink: 0,
    }}>
      <span style={{ fontSize: 16, fontWeight: 600, color: 'black' }}>{title}</span>
      {children}
      {action && (
        <button
          onClick={onAction}
          style={{ fontSize: 16, fontWeight: 600, color: '#6dbe4b', cursor: 'pointer' }}
        >
          {action}
        </button>
      )}
    </div>
  )
}

// ─── Location expand rows ──────────────────────────────────────────────────────

function PctBadge({ pct }) {
  if (pct === null) return null
  const positive = pct >= 0
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      borderRadius: 16, padding: '2px 8px 2px 10px',
      background: positive ? '#d3ebc9' : '#f0f0f0',
      flexShrink: 0,
    }}>
      {positive ? <TrendUp color="#2d5e3f" /> : <TrendDown color="#606060" />}
      <span style={{ fontSize: 16, color: positive ? '#2d5e3f' : '#606060', whiteSpace: 'nowrap' }}>{Math.abs(pct)}%</span>
    </div>
  )
}

function SalesLocationRows({ grossNet, locations }) {
  const totalSales = locations.reduce((sum, loc) => sum + loc.sales, 0)
  return (
    <div className="expand-enter" style={{ borderTop: '1px solid #d9d9d9' }}>
      {locations.map((loc, i) => {
        const salesVal = grossNet === 'net' ? loc.sales * 0.555 : loc.sales
        const pct = Math.round(loc.sales / totalSales * 100)
        const invoiceText = loc.invoiceCount > 0
          ? ` (including ${fmtNum(loc.invoiceCount)} invoice${loc.invoiceCount !== 1 ? 's' : ''})`
          : ''
        return (
          <div key={loc.name} style={{ display: 'flex', alignItems: 'center', borderTop: i > 0 ? '1px solid #d9d9d9' : 'none', minHeight: 64 }}>
            <div style={{ width: 400, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 500, color: 'black', whiteSpace: 'nowrap' }}>{fmt(salesVal)}</span>
              <span style={{ fontSize: 16, color: 'black', whiteSpace: 'nowrap' }}>{loc.label}</span>
              <PctBadge pct={loc.salesPct} />
            </div>
            <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ height: 6, borderRadius: 3, background: '#d9d9d9', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#6dbe4b', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 16, color: 'black' }}>
                <strong style={{ fontWeight: 600 }}>{pct}% of sales</strong>
                {` with ${fmtNum(loc.orders)} ${loc.orders === 1 ? 'order' : 'orders'} and ${fmtNum(loc.customers)} ${loc.customers === 1 ? 'customer' : 'customers'}${invoiceText}`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrdersLocationRows({ locations }) {
  return (
    <div className="expand-enter" style={{ borderTop: '1px solid #d9d9d9' }}>
      {locations.map((loc, i) => (
        <div key={loc.name} style={{ display: 'flex', alignItems: 'center', borderTop: i > 0 ? '1px solid #d9d9d9' : 'none', minHeight: 64, padding: '20px 24px', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 500, color: 'black', whiteSpace: 'nowrap' }}>{fmtNum(loc.orders)}</span>
          <span style={{ fontSize: 16, fontWeight: 400, color: 'black', whiteSpace: 'nowrap' }}>
            {loc.orders === 1 ? 'order' : 'orders'} {loc.label}
          </span>
          <PctBadge pct={loc.orderPct} />
        </div>
      ))}
    </div>
  )
}

function CustomersLocationRows({ locations }) {
  return (
    <div className="expand-enter" style={{ borderTop: '1px solid #d9d9d9' }}>
      {locations.map((loc, i) => (
        <div key={loc.name} style={{ display: 'flex', alignItems: 'center', borderTop: i > 0 ? '1px solid #d9d9d9' : 'none', minHeight: 64, padding: '20px 24px', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: 'black' }}>{fmtNum(loc.customers)}</span>
            <span style={{ fontSize: 16, color: 'black', whiteSpace: 'nowrap' }}>customers {loc.label}</span>
          </div>
          <span style={{ fontSize: 16, color: '#606060', whiteSpace: 'nowrap' }}>
            {fmtNum(loc.newCust)} new / {fmtNum(loc.returning)} returning
          </span>
        </div>
      ))}
    </div>
  )
}

function LocationToggle({ expanded, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '100%', height: 45, display: 'flex', alignItems: 'center',
        gap: 12, padding: '0 14px', cursor: 'pointer', background: 'transparent',
        transition: 'background 0.1s', textAlign: 'left',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', display: 'flex' }}>
        <ChevronRight size={22} color="#606060" />
      </span>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'black' }}>Breakdown by location (3)</span>
    </button>
  )
}

// ─── Overall Sales Card ────────────────────────────────────────────────────────

function OverallSalesCard({ dateFilter, grossNet, setGrossNet }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = DATE_CONFIG[dateFilter]
  const { sales, orders, customers, invoices, locations } = cfg

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 10, overflow: 'hidden', width: '100%', background: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}>
      <div style={{
        background: '#f0f0f0', height: 44, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 14px',
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'black' }}>Overall sales</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {['Gross', 'Net'].map((opt, i) => (
            <span key={opt} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {i === 1 && <span style={{ color: '#ababab', fontWeight: 600, fontSize: 16, margin: '0 2px' }}>/</span>}
              <button
                onClick={() => setGrossNet(opt.toLowerCase())}
                style={{
                  padding: '4px 6px', borderRadius: 19, fontSize: 16, fontWeight: 600,
                  cursor: 'pointer', transition: 'color 0.15s',
                  color: grossNet === opt.toLowerCase() ? '#6dbe4b' : '#ababab',
                }}
              >
                {opt}
              </button>
            </span>
          ))}
        </div>
      </div>
      <Divider />

      <div style={{ display: 'flex' }}>
        {[
          {
            label: grossNet === 'gross' ? 'Gross sales' : 'Net sales',
            value: grossNet === 'gross' ? fmt(sales.gross) : fmt(sales.net),
            sub: <ComparisonTag text={sales.compText} positive={sales.positive} />,
          },
          {
            label: 'Orders',
            value: fmtNum(orders.total),
            sub: <span style={{ fontSize: 16, color: '#606060' }}>Avg. ${orders.avg.toFixed(2)} / order</span>,
          },
          {
            label: 'Customers',
            value: fmtNum(customers.total),
            sub: <span style={{ fontSize: 16, color: '#606060' }}>{fmtNum(customers.returning)} returning</span>,
          },
          {
            label: 'Invoice payments',
            value: fmt(invoices.total),
            sub: <span style={{ fontSize: 16, color: '#e6803d' }}>{fmtNum(invoices.count)} invoice{invoices.count !== 1 ? 's' : ''} paid</span>,
          },
        ].map((item, i) => (
          <div key={i} style={{
            flex: 1, minWidth: 0, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 10,
            borderLeft: i > 0 ? '1px solid #d9d9d9' : 'none',
          }}>
            <span style={{ fontSize: 16, color: 'black' }}>{item.label}</span>
            <span style={{ fontSize: 24, fontWeight: 600, color: 'black' }}>{item.value}</span>
            {item.sub}
          </div>
        ))}
      </div>

      {invoices.total > 0 && (
        <div style={{ background: '#fdede2', height: 45, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e6803d', flexShrink: 0 }} />
          <span style={{ fontSize: 16, color: 'black' }}>
            Invoice payments are included in gross sales. These originated from your Wholesale catalog.
          </span>
        </div>
      )}
      <Divider />

      <LocationToggle expanded={expanded} onToggle={() => setExpanded(!expanded)} />
      {expanded && <SalesLocationRows grossNet={grossNet} locations={locations} />}
    </div>
  )
}

// ─── Sales Over Time Card ──────────────────────────────────────────────────────

function SalesOverTimeCard({ dateFilter, grossNet, setGrossNet }) {
  const [compareYesterday, setCompareYesterday] = useState(false)
  const [activeBar, setActiveBar] = useState(null)
  const [metric, setMetric] = useState('Sales')
  const [location, setLocation] = useState('All')
  const [showLocDrop, setShowLocDrop] = useState(false)

  useEffect(() => {
    setCompareYesterday(false)
    setActiveBar(null)
  }, [dateFilter])

  const cfg = DATE_CONFIG[dateFilter]
  const data = cfg.graph[metric]
  const locData = data[location] || data['All']
  const barLabels = cfg.barLabels
  const NET_RATIO = cfg.sales.net / cfg.sales.gross
  const rawToday = locData.today
  const rawYest  = locData.yesterday
  const todayVals = metric === 'Sales' && grossNet === 'net' ? rawToday.map(v => v * NET_RATIO) : rawToday
  const yestVals  = metric === 'Sales' && grossNet === 'net' ? rawYest.map(v => v * NET_RATIO)  : rawYest
  const maxVal    = Math.max(...todayVals, ...(compareYesterday ? yestVals : [0]))
  const CHART_H   = 200

  const handleBarClick = (key) => setActiveBar(activeBar === key ? null : key)

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 10, overflow: 'hidden', width: '100%', background: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}>
      <CardHeader title="Sales over time">
        {metric === 'Sales' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {['Gross', 'Net'].map((opt, i) => (
              <span key={opt} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {i === 1 && <span style={{ color: '#ababab', fontWeight: 600, fontSize: 16, margin: '0 2px' }}>/</span>}
                <button
                  onClick={() => setGrossNet(opt.toLowerCase())}
                  style={{
                    padding: '4px 6px', borderRadius: 19, fontSize: 16, fontWeight: 600,
                    cursor: 'pointer', transition: 'color 0.15s',
                    color: grossNet === opt.toLowerCase() ? '#6dbe4b' : '#ababab',
                  }}
                >
                  {opt}
                </button>
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      <Divider />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLocDrop(!showLocDrop)}
              style={{
                height: 52, borderRadius: 10, border: '1px solid #d9d9d9',
                padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 16, cursor: 'pointer', background: 'white',
                color: '#231f20', whiteSpace: 'nowrap',
              }}
            >
              <MapMarkerIcon />
              <span>Locations: <strong style={{ fontWeight: 500 }}>{location === 'All' ? 'All' : location.split(' ')[0]}</strong></span>
              <ChevronDown size={20} />
            </button>
            {showLocDrop && (
              <Dropdown options={GRAPH_LOCATIONS} value={location} onSelect={setLocation} onClose={() => setShowLocDrop(false)} />
            )}
          </div>
          {['Sales', 'Orders', 'Customers'].map(m => (
            <FilterChip key={m} label={m} active={metric === m}
              onClick={() => { setMetric(m); setActiveBar(null) }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {compareYesterday && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D3EBC9' }} />
              <span style={{ fontSize: 16, color: 'black' }}>{cfg.priorLabel}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6dbe4b' }} />
            <span style={{ fontSize: 16, color: 'black' }}>{cfg.currentLabel}</span>
          </div>
          <button
            onClick={() => { setCompareYesterday(!compareYesterday); setActiveBar(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              border: compareYesterday ? '1px solid #6dbe4b' : '1px solid #606060',
              background: compareYesterday ? '#6dbe4b' : 'transparent',
            }}>
              {compareYesterday && <CheckIcon />}
            </div>
            <span style={{ fontSize: 16, color: '#231f20' }}>{cfg.compareLabel}</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: CHART_H + 20 }}>
          {barLabels.map((label, i) => {
            const todayH = maxVal > 0 ? (todayVals[i] / maxVal) * CHART_H : 0
            const yestH  = maxVal > 0 ? (yestVals[i]  / maxVal) * CHART_H : 0
            const todayKey = `t${i}`
            const yestKey  = `y${i}`

            return (
              <div key={label} style={{
                flex: 1, display: 'flex', alignItems: 'flex-end',
                justifyContent: 'center', gap: compareYesterday ? 2 : 0,
                height: '100%', padding: '0 3px',
              }}>
                {compareYesterday && (
                  <div
                    onClick={() => handleBarClick(yestKey)}
                    style={{
                      flex: 1, height: yestH, background: '#D3EBC9',
                      borderRadius: '3px 3px 0 0', cursor: 'pointer',
                      position: 'relative', transition: 'opacity 0.1s', minWidth: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {activeBar === yestKey && yestH > 0 && (
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#edf7e8', border: '1px solid white',
                        borderRadius: 19, padding: '4px 10px', whiteSpace: 'nowrap',
                        fontSize: 14, lineHeight: '16px', color: '#231f20', zIndex: 10,
                      }}>
                        {data.fmt(yestVals[i])}
                      </div>
                    )}
                  </div>
                )}
                <div
                  onClick={() => handleBarClick(todayKey)}
                  style={{
                    flex: 1, height: Math.max(todayH, 2), background: '#6dbe4b',
                    borderRadius: '3px 3px 0 0', cursor: 'pointer',
                    position: 'relative', transition: 'opacity 0.1s', minWidth: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {activeBar === todayKey && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: '#edf7e8', border: '1px solid white',
                      borderRadius: 19, padding: '4px 10px', whiteSpace: 'nowrap',
                      fontSize: 14, lineHeight: '16px', color: '#231f20', zIndex: 10,
                    }}>
                      {data.fmt(todayVals[i])}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', marginTop: 8 }}>
          {barLabels.map(h => (
            <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: 14, color: '#606060' }}>{h}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Orders Card ──────────────────────────────────────────────────────────────

function OrdersCard({ dateFilter, expanded, onToggle }) {
  const cfg = DATE_CONFIG[dateFilter]
  const { orders, periodLabel, locations } = cfg

  return (
    <div style={{
      flex: 1, border: '1px solid #d9d9d9', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
      background: 'white', display: 'flex', flexDirection: 'column',
    }}>
      <CardHeader title="Orders" />
      <Divider />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: 'black' }}>{fmtNum(orders.total)}</span>
          <span style={{ fontSize: 16, color: 'black' }}>Orders {periodLabel}</span>
        </div>
        <ComparisonTag text={orders.compText} positive={orders.positive} />
      </div>
      <Divider />
      <LocationToggle expanded={expanded} onToggle={onToggle} />
      {expanded && <OrdersLocationRows locations={locations} />}
    </div>
  )
}

// ─── Customers Card ───────────────────────────────────────────────────────────

function CustomersCard({ dateFilter, expanded, onToggle }) {
  const cfg = DATE_CONFIG[dateFilter]
  const { customers, periodLabel, locations } = cfg

  return (
    <div style={{
      flex: 1, border: '1px solid #d9d9d9', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
      background: 'white', display: 'flex', flexDirection: 'column',
    }}>
      <CardHeader title="Customers" />
      <Divider />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: 'black' }}>{fmtNum(customers.total)}</span>
          <span style={{ fontSize: 16, color: 'black' }}>Total customers {periodLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'baseline' }}>
          <span style={{ fontSize: 24, fontWeight: 600, color: 'black' }}>
            {fmtNum(customers.newCust)} <span style={{ fontSize: 16, fontWeight: 400 }}>New</span>
          </span>
          <span style={{ fontSize: 24, fontWeight: 600, color: 'black' }}>
            {fmtNum(customers.returning)} <span style={{ fontSize: 16, fontWeight: 400 }}>Returning</span>
          </span>
        </div>
      </div>
      <Divider />
      <LocationToggle expanded={expanded} onToggle={onToggle} />
      {expanded && <CustomersLocationRows locations={locations} />}
    </div>
  )
}

// ─── Product Sales Card ───────────────────────────────────────────────────────

function ProductSalesCard({ dateFilter }) {
  const [category, setCategory]         = useState('All')
  const [sortBy, setSortBy]             = useState('Highest sales')
  const [showSortDrop, setShowSortDrop] = useState(false)
  const [showAll, setShowAll]           = useState(false)

  useEffect(() => { setShowAll(false) }, [category, sortBy, dateFilter])

  const mult = DATE_CONFIG[dateFilter].productMult
  const scaledProducts = PRODUCTS.map(p => ({
    ...p,
    qty:   Math.round(p.qty * mult),
    gross: p.gross * mult,
    net:   p.net   * mult,
  }))

  const filtered  = scaledProducts.filter(p => category === 'All' || p.category === category)
  const sorted    = [...filtered].sort((a, b) => {
    if (sortBy === 'Highest sales') return b.gross - a.gross
    if (sortBy === 'Lowest sales')  return a.gross - b.gross
    if (sortBy === 'Most sold')     return b.qty   - a.qty
    return a.name.localeCompare(b.name)
  })
  const displayed = showAll ? sorted : sorted.slice(0, 6)
  const more      = sorted.length - 6

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 10, overflow: 'hidden', background: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}>
      <CardHeader title="Product sales" />
      <Divider />

      <div style={{
        background: '#EDE9FC',
        display: 'flex', alignItems: 'flex-start', padding: '12px 12px',
      }}>
        <span style={{ fontSize: 16, color: 'black' }}>
          💡 {PRODUCT_INSIGHTS[dateFilter]}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 12, padding: '16px 0' }}>
          {CATEGORIES.map(cat => (
            <FilterChip key={cat} label={cat} active={category === cat} onClick={() => setCategory(cat)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortDrop(!showSortDrop)}
              style={{
                height: 52, borderRadius: 10, border: '1px solid #d9d9d9',
                padding: '0 14px', display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 16, cursor: 'pointer', background: 'white', color: '#231f20', whiteSpace: 'nowrap',
              }}
            >
              <SortIcon />
              <span>Sort by: <strong style={{ fontWeight: 500 }}>{sortBy}</strong></span>
              <ChevronDown size={20} />
            </button>
            {showSortDrop && (
              <Dropdown options={SORT_OPTIONS} value={sortBy}
                onSelect={setSortBy} onClose={() => setShowSortDrop(false)} right />
            )}
          </div>
        </div>
      </div>

      <Divider />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[
          { label: 'Product',     w: 220 },
          { label: 'Category',    w: 140 },
          { label: 'Qty. Sold',   w: 110 },
          { label: 'Gross sales', w: 200 },
          { label: 'Net sales',   w: null },
        ].map(col => (
          <div key={col.label} style={{ width: col.w || undefined, flex: col.w ? undefined : 1, padding: 14 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'black' }}>{col.label}</span>
          </div>
        ))}
      </div>

      {displayed.map((p, i) => (
        <div key={`${p.name}-${i}`} style={{
          display: 'flex', alignItems: 'center',
          borderTop: '1px solid #d9d9d9',
          background: i % 2 === 0 ? 'white' : '#f8f8f8',
        }}>
          <div style={{ width: 220, padding: 14 }}><span style={{ fontSize: 16, color: 'black' }}>{p.name}</span></div>
          <div style={{ width: 140, padding: 14 }}><span style={{ fontSize: 16, color: 'black' }}>{p.category}</span></div>
          <div style={{ width: 110, padding: 14 }}><span style={{ fontSize: 16, color: 'black' }}>{p.qty.toLocaleString()}</span></div>
          <div style={{ width: 200, padding: 14 }}><span style={{ fontSize: 16, color: 'black' }}>{fmt(p.gross)}</span></div>
          <div style={{ flex: 1, padding: 14 }}><span style={{ fontSize: 16, color: 'black' }}>{fmt(p.net)}</span></div>
        </div>
      ))}

      {more > 0 && (
        <div
          onClick={() => setShowAll(!showAll)}
          style={{ borderTop: '1px solid #d9d9d9', height: 45, display: 'flex', alignItems: 'center', padding: '0 14px', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: '#606060' }}>
            {showAll ? 'Show less' : `+ ${more} more`}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── iPad Status Bar ──────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{
      background: '#231f20', height: 24,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>9:41 AM</span>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Tue Sep 24</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'white', fontSize: 11, fontWeight: 500 }}>100%</span>
        <svg width="16" height="12" viewBox="0 0 20 15" fill="white">
          <path d="M10 3.5C6.9 3.5 4.1 4.7 2 6.8L0 4.8C2.7 2 6.1 0.5 10 0.5s7.3 1.5 10 4.3l-2 2C15.9 4.7 13.1 3.5 10 3.5z" />
          <path d="M10 7.5C7.7 7.5 5.7 8.5 4.2 10L2.2 8C4.2 6 6.9 4.9 10 4.9s5.8 1.1 7.8 3.1l-2 2C14.3 8.5 12.3 7.5 10 7.5z" />
          <circle cx="10" cy="13" r="2.5" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 22, height: 11, border: '1px solid rgba(255,255,255,0.7)', borderRadius: 2, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 1, background: 'white', borderRadius: 1 }} />
          </div>
          <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.5)', marginLeft: 1, borderRadius: '0 1px 1px 0' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [dateFilter, setDateFilter]       = useState('Today')
  const [grossNet, setGrossNet]           = useState('gross')
  const [showDateDrop, setShowDateDrop]   = useState(false)
  const [showExportDrop, setShowExportDrop] = useState(false)
  const [titleVisible, setTitleVisible]   = useState(true)
  const [locExpanded, setLocExpanded]     = useState(false)
  const scrollRef     = useRef(null)
  const lastScrollTop = useRef(0)

  useEffect(() => {
    const handler = () => setShowDateDrop(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const cur  = el.scrollTop
      const prev = lastScrollTop.current
      if (cur <= 0) {
        setTitleVisible(true)
      } else if (cur > prev + 2) {
        setTitleVisible(false)
      } else if (cur < prev - 2) {
        setTitleVisible(true)
      }
      lastScrollTop.current = cur
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ width: 1134, height: 744, display: 'flex', flexDirection: 'column', background: '#fafafa', overflow: 'hidden' }}>

      <StatusBar />

      {/* Title bar — collapses on scroll down */}
      <div style={{
        background: '#fafafa', flexShrink: 0, overflow: 'hidden',
        maxHeight: titleVisible ? 64 : 0,
        transition: 'max-height 0.28s ease',
      }}>
        <div style={{ padding: '12px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button style={{
              background: '#f0f0f0', borderRadius: 10, height: 52, width: 52,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <ArrowLeft />
            </button>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#231f20' }}>Reports</span>
            <div style={{ marginLeft: 'auto', width: 40, height: 40, borderRadius: '50%', background: '#6dbe4b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              🌱
            </div>
          </div>
        </div>
      </div>

      {/* Actions bar — always sticky */}
      <div style={{ background: '#fafafa', flexShrink: 0, borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowDateDrop(!showDateDrop)}
              style={{
                height: 52, borderRadius: 10, border: '1px solid #d9d9d9',
                padding: '0 14px', display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 16, cursor: 'pointer', background: 'white', color: '#231f20',
              }}
            >
              <CalendarIcon />
              <span>Date: <strong style={{ fontWeight: 500 }}>{dateFilter}</strong></span>
              <ChevronDown size={20} />
            </button>
            {showDateDrop && (
              <Dropdown
                options={DATE_OPTIONS}
                value={dateFilter}
                onSelect={v => { setDateFilter(v); setShowDateDrop(false) }}
                onClose={() => setShowDateDrop(false)}
              />
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowExportDrop(!showExportDrop)}
              style={{
                height: 52, borderRadius: 10, border: '2px solid #6dbe4b',
                padding: '0 24px', fontSize: 16, fontWeight: 700,
                color: '#6dbe4b', cursor: 'pointer', background: 'transparent',
                transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#edf7e8'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Export
              <ChevronDown size={18} color="#6dbe4b" />
            </button>
            {showExportDrop && (
              <div
                className="dropdown-enter"
                style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  background: 'white', border: '1px solid #d9d9d9', borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100,
                  minWidth: 200, overflow: 'hidden',
                }}
              >
                {[
                  { label: 'View in browser' },
                  { label: 'Export as CSV' },
                  { label: 'Print a summary' },
                ].map(({ label }) => (
                  <button
                    key={label}
                    onClick={() => setShowExportDrop(false)}
                    style={{
                      width: '100%', padding: '14px 18px', textAlign: 'left',
                      fontSize: 16, color: '#231f20', cursor: 'pointer',
                      background: 'transparent', display: 'block',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <AiCallout dateFilter={dateFilter} />
          <OverallSalesCard dateFilter={dateFilter} grossNet={grossNet} setGrossNet={setGrossNet} />
          <SalesOverTimeCard dateFilter={dateFilter} grossNet={grossNet} setGrossNet={setGrossNet} />
          <div style={{ display: 'flex', gap: 28 }}>
            <OrdersCard
              dateFilter={dateFilter}
              expanded={locExpanded}
              onToggle={() => setLocExpanded(!locExpanded)}
            />
            <CustomersCard
              dateFilter={dateFilter}
              expanded={locExpanded}
              onToggle={() => setLocExpanded(!locExpanded)}
            />
          </div>
          <ProductSalesCard dateFilter={dateFilter} />
          <div style={{ height: 32 }} />
        </div>
      </div>

    </div>
  )
}
