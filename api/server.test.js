// testleri buraya yazın
const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const bcryptjs = require("bcryptjs");
afterAll(async () => {
  await db.destroy()
})
beforeAll(async ()=>{
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
})

test('[0] Testler çalışır durumda]', () => {
  expect(true).toBe(true)
})


describe("Auth Test",()=>{
  it("[1] Register Başarılı mı?",async()=>{
    //arrange
    let model = {username:"veysel",password:"1234"};
    //act
    let actual = await request(server).post("/api/auth/register").send(model);
    //assert
    expect(actual.status).toBe(201);
    expect(actual.body.id).toBeGreaterThan(0);
  })
  it("[2] Password hashleniyor mu?",async()=>{
    //arrange
    let model = {username:"veysel33",password:"1234"};
    //act
    let actual = await request(server).post("/api/auth/register").send(model);
    let isHashed = bcryptjs.compareSync(model.password,actual.body.password);
    //assert
    expect(actual.status).toBe(201);
    expect(isHashed).toBeTruthy();
  })
  it("[3] Login token dönüyor mu?",async()=>{
    //arrange
    let model = {username:"bob",password:"1234"};
    //act
    let actual = await request(server).post("/api/auth/login").send(model);
    //assert
    expect(actual.status).toBe(200);
    expect(actual.body.token).toBeDefined();
  })
  it("[4] Login eksik payload durumunda hata dönüyor mu?",async()=>{
    //arrange
    let model = {username:"bob"};
    //act
    let actual = await request(server).post("/api/auth/login").send(model);
    //assert
    expect(actual.status).toBe(400);
  })
});
describe("Bilmeceler test",()=>{
  it("[5] token geçerli ise bilmeceler dönüyor mu?",async()=>{
    //arrange
    let model = {username:"bob",password:"1234"};
    //act
    let loginResult = await request(server).post("/api/auth/login").send(model);
    let actual = await request(server)
    .get("/api/bilmeceler")
    .set('authorization', loginResult.body.token);
    //assert
    expect(actual.status).toBe(200);
    expect(actual.body.length).toBe(3);
  })
  it("[6] logout olmuş bir kullanıcıda bilmeceler çalışıyor?",async()=>{
    //arrange
    let model = {username:"bob",password:"1234"};
    //act
    let loginResult = await request(server).post("/api/auth/login").send(model);
     await request(server).get("/api/auth/logout")
     .send(model)
     .set('authorization', loginResult.body.token);
    let actual = await request(server)
    .get("/api/bilmeceler")
    .set('authorization', loginResult.body.token);
    //assert
    expect(actual.status).toBe(400);
    expect(actual.body.message).toBe("Daha önce çıkış yapılmış. Tekrar giriş yapınız");
  })
});