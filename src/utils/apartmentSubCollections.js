const conditionList = [
  { en: "balcony", zh: "陽台" },
  { en: "elevator", zh: "電梯" },
  { en: "garbageManagement", zh: "垃圾集中管理" },
  { en: "guard", zh: "大樓管理員" },
  { en: "parking", zh: "停車位" },
  { en: "pet", zh: "可養寵物" },
].map((item) => ({
  docName: item.en,
  content: { id: item.en, name: item.zh, value: false },
}));

const facilityList = [
  { en: "airCon", zh: "冷氣" },
  { en: "fridge", zh: "冰箱" },
  { en: "kitchen", zh: "廚房" },
  { en: "laundry", zh: "洗衣機" },
  { en: "naturalGas", zh: "天然氣" },
  { en: "waterHeater", zh: "熱水器" },
  { en: "payCable", zh: "第四台" },
  { en: "wifi", zh: "Wi-Fi" },
].map((item) => ({
  docName: item.en,
  content: { id: item.en, name: item.zh, value: false },
}));

const furnitureList = [
  { en: "bed", zh: "床" },
  { en: "chair", zh: "椅子" },
  { en: "closet", zh: "衣櫥" },
  { en: "sofa", zh: "沙發" },
  { en: "table", zh: "桌子" },
].map((item) => ({
  docName: item.en,
  content: { id: item.en, name: item.zh, value: false },
}));

export { conditionList, facilityList, furnitureList };
