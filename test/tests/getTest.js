const fannomi = encodeURIComponent("Kompyter tizimlari va tarmoqlari");
const darsnomi = encodeURIComponent("1-dars");


fetch(`http://localhost:3000/api/test/${fannomi}/${darsnomi}/"67a09062a3a5ec0de002271d"`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTA4MTYyMjVmNzQzMDc5NGYzZTJkYSIsInVzZXJuYW1lIjoiZGV2b2xvcGVyIiwiZmlyc3RuYW1lIjoiUmFobWFkam9uIiwibGFzdG5hbWUiOiJBYmR1bGxheWV2IiwiZ3JvdXAiOiIzNi1BVFQtMjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mzg1NzI1MTN9.RnkLnTBX8D43uVzMCvC5tpwU6qXKZ1Kt0MmAOVnKGno",
  },
  body: 'salom',
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => console.log("barcha testlar olindi:", data))
  .catch((error) => console.error("Xatolik:", error));
