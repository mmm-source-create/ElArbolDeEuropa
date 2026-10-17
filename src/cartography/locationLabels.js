const LABELS = Object.freeze({Slano: 'Primorje de Slano', Slano_Peljesac: 'Pelješac y Ston', Slano_Korcula: 'Korčula', Slano_Mljet: 'Mljet', Dubrovnik: 'Dubrovnik y Elafiti', Dubrovnik_Konavle: 'Konavle', Lastovo_Island_Wasteland: 'Lastovo y Sušac', Glaz: 'Glaž', Kozara: 'Kozara', Kljuc: 'Ključ'});
export const locationLabel = id => LABELS[id] || String(id).replaceAll('_', ' ');
