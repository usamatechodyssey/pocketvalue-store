// /lib/pakistan-data.ts

export const provinces = [
    { value: "Punjab", label: "Punjab" },
    { value: "Sindh", label: "Sindh" },
    { value: "Khyber Pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
    { value: "Balochistan", label: "Balochistan" },
    { value: "Islamabad Capital Territory", label: "Islamabad" },
    { value: "Gilgit-Baltistan", label: "Gilgit-Baltistan" },
    { value: "Azad Kashmir", label: "Azad Kashmir" },
];

export const citiesByProvince: { [key: string]: { value: string; label: string }[] } = {
    "Punjab": [ { value: "Lahore", label: "Lahore" }, { value: "Faisalabad", label: "Faisalabad" }, { value: "Rawalpindi", label: "Rawalpindi" }, { value: "Multan", label: "Multan" }, { value: "Gujranwala", label: "Gujranwala" }, /* ...aur bohat se sheher */ ],
    "Sindh": [ { value: "Karachi", label: "Karachi" }, { value: "Hyderabad", label: "Hyderabad" }, { value: "Sukkur", label: "Sukkur" }, { value: "Larkana", label: "Larkana" }, /* ... */ ],
    "Khyber Pakhtunkhwa": [ { value: "Peshawar", label: "Peshawar" }, { value: "Abbottabad", label: "Abbottabad" }, { value: "Mardan", label: "Mardan" }, /* ... */ ],
    "Balochistan": [ { value: "Quetta", label: "Quetta" }, { value: "Gwadar", label: "Gwadar" }, /* ... */ ],
    "Islamabad Capital Territory": [ { value: "Islamabad", label: "Islamabad" } ],
    // ... baaki provinces ke sheher
};

// NOTE: Yeh list abhi mukhtasar hai. Hum ismein GitHub par mojood open-source data se tamam sheher add kar sakte hain.