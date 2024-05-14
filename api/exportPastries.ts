import pastries from "./data/pastries.json";
import PastryEntity from "./src/entity/Pastry.model";

const exportPastries = async () => {
  const allPastries = await PastryEntity.find();
  const pastriesToInsert = pastries
    .filter((p) => !allPastries.find((ap: any) => ap.name === p.name))
    .map((p) => {
      return {
        name: p.name,
        image: p.image,
        stock: p.stock,
        winners: [],
      };
    });
  if (pastriesToInsert.length) {
    await PastryEntity.insertMany(pastriesToInsert);
  }
  console.log(`Pastries dumped ==> ${pastriesToInsert.length}`);
};

export default exportPastries;
