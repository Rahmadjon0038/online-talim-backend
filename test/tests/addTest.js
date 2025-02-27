// const fannomi = encodeURIComponent("Kompyter tizimlari va tarmoqlari");
// const darsnomi = encodeURIComponent("1-dars");
// const newTest = {
//   title: "3-test css nima",
//   variant: [
//     {
//       name: "bilmasam",
//       correct: false,
//     },
//     {
//       name: "dizayn uchun",
//       correct: true,
//     },
//     {
//       name: "bilmadim",
//       correct: false,
//     },
//     {
//       name: "Belgilash turi",
//       correct: true,
//     },
//   ],
// };

// fetch(`http://localhost:3000/api/test/${fannomi}/${darsnomi}`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTA4MTYyMjVmNzQzMDc5NGYzZTJkYSIsInVzZXJuYW1lIjoiZGV2b2xvcGVyIiwiZmlyc3RuYW1lIjoiUmFobWFkam9uIiwibGFzdG5hbWUiOiJBYmR1bGxheWV2IiwiZ3JvdXAiOiIzNi1BVFQtMjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mzg1ODE1ODl9.fETiHXp7lgHJetxz4zNgE_VPNVXAqbCmad0oGG6Ganw",
//   },
//   body: JSON.stringify(newTest),
// })
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`Server xatosi: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then((data) => console.log("Yangi test muvaffaqiyatli qo‘shildi:", data))
//   .catch((error) => console.error("Xatolik:", error));
const fannomi = 'Kompyter tizimlari va tarmoqlari'
const apiUrl = `http://localhost:3000/api/test/${fannomi}/results`

fetch(apiUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTBjNDFhM2U0MTUxMGYwNDNiNTQ2NiIsInVzZXJuYW1lIjoiaXNtMTIzIiwiZmlyc3RuYW1lIjoiaXNtMTIzIiwibGFzdG5hbWUiOiJpc20xMjMiLCJncm91cCI6IjM2LUFUVC0yMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM5MjAzNTkxfQ.cFfHZCowC0Xy-d4xx7ws3HQKSA1XqXnYb1-8qJspdVY `
  }
}).then((res) => console.log(res.data))
  .catch(err => console.log(err))


