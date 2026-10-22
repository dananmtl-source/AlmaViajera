interface Country {
  iso2: string;
  commonName: string;
  flagUrl: string;
  dialCode: string;
  currencyCode: string;
  currencySymbol: string;
}

// Cache the full list — it changes rarely
let countriesCache: Country[] | null = null;

export async function getAllCountries(): Promise<Country[]> {
  if (countriesCache) return countriesCache;

  const res = await fetch(
    `https://api.apogeoapi.com/v1/countries?apikey=${apiKeys.env.NUESTRA_APOGEO_KEY}`
  );
  const data = await res.json();
  countriesCache = data;
  return data;
}

// React phone number selector with dial codes
// import { useEffect, useState } from 'react';

// export function PhoneInput() {
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [selectedDial, setSelectedDial] = useState('+1');
//   const [phone, setPhone] = useState('');

//   useEffect(() => {
//     getAllCountries().then(setCountries);
//   }, []);

//   return (
//     <div className="flex gap-2">
//       <select
//         value={selectedDial}
//         onChange={e => setSelectedDial(e.target.value)}
//         className="border rounded px-2 py-1 w-28"
//       >
//         {countries.map(c => (
//           <option key={c.iso2} value={c.dialCode}>
//             {c.iso2} {c.dialCode}
//           </option>
//         ))}
//       </select>
//       <input
//         type="tel"
//         value={phone}
//         onChange={e => setPhone(e.target.value)}
//         placeholder="Phone number"
//         className="border rounded px-3 py-1 flex-1"
//       />
//     </div>
//   );
// }