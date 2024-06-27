import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:9000");

describe("Testing Ecommerce FitnessStore", () => {
  describe("Testing Products ", () => {
    let uid;

    it("Crear prducto: El API POST /api/products debe crear un producto correctamente", async () => {
      //Given
      const product = {
        title: "Testing product",
        description: "Product to test",
        code: "Test1",
        price: 10,
        stock: 4,
        thumbnail: "https://www.google.com",
        category: "Testing",
        owner: "test@gmail.com"
      };

      //Then
      const response = await requester
        .post("/api/products")
        .send(product);

      uid = response.body.newproduct._id;
      //Assert
      expect(response.body.newproduct._id).to.be.ok;
      expect(response.statusCode).is.eqls(200);
    });

    it("Crear prducto sin un dato requerido: El API POST /api/products no debe crear un producto y debe retornar status code HTTP 400", async () => {
      //Given
      const product = {

        description: "Product to test",
        code: "Test2",
        price: 10,
        stock: 4,
        category: "Testing",
      };

      //Then
      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(product);

      //Assert
      expect(statusCode).is.eql(400);
      expect(ok).is.eql(false);
    });

    it("Actualizar producto: El API PUT /api/products/:id debe actualizar un producto correctamente", async () => {
      //Given
      const product = {
        title: "Testing product",
        description: "Product to test",
        code: "Test1",
        price: 10,
        stock: 4,
        thumbnail: "https://www.google.com",
        category: "Testing",
        owner: "moises@gmail"
      };

      //Then
      const response = await requester
        .put(`/api/products/${uid}`)
        .send(product);

      //Assert
      expect(response.body.updatedproduct).to.be.ok; 
      expect(response.statusCode).is.eqls(200);

    });

    it("Arroja un Producto segun un ID indicado: El API GET /api/products/:id debe retornar un producto correctamente", async () => {
      //Then
      const response = await requester
        .get(`/api/products/${uid}`);

      // console.log(response.body.productfind);
      //Assert
      expect(response.body.productfind).to.be.ok;
      expect(response.statusCode).is.eqls(200);
    });

    after(async function () {
      const result = await requester.delete(`/api/products/${uid}`);
    });
  });

  describe("Testing Carts", () => {

    describe('Testin Rutas /api/carts', () => {
      it('debería devolver 400 si obj no es Array', async () => {
          const response = await requester
              .post('/api/carts')
              .send({ obj: 'not an array' });
  
          expect(response.statusCode).is.eqls(400);
          expect(response.text).is.eqls('Invalid request: products must be an array');
      });

      it('Debe devolver 200 y el carrito creado si todos los productos existen', async () => {
          const response = await requester
              .post('/api/carts')
              .send({ obj: [{ _id: '65dbd3892f8d8dd003f9453a' }] }); // Asegúrate de que este producto existe en tu base de datos
  
          expect(response.statusCode).is.eqls(200);
          expect(response.body).to.have.property('_id'); // Asegúrate de que la respuesta tiene la forma esperada
      });

      it("La ruta debe retornar un Cart segun su ID", async () => {
        //Given
        const response = await requester
          .get(`/api/carts/66136a1f6295eaf37f71e1f0`);

        //Assert
        expect(response.body.carritofound).to.be.ok;
        expect(response.statusCode).is.eqls(200);

      });
      it("La ruta debe retornar un arreglo con todos los Cart", async () => {
        //Given
        const response = await requester
          .get(`/api/carts`);

        //Assert
        expect(response.body.carrito).to.be.ok;
        expect(response.statusCode).is.eqls(200);
      });
      it("La ruta debe retornar 404 si el Cart no existe", async () => {
        //Given
        const response = await requester
          .get(`/api/carts/123456`);
        //Assert
        expect(response.statusCode).is.eqls(404);
      });

  });
  });

  describe("Test de registro y login POST /register", () => {
    let cookie;
    before(async function () {

      this.mockUser = {
        username: "correoTest@gmail.com",
        name: "Nombre de prueba",
        lastname: "Apellido de prueba",
        tel: "123456789",
        password: "123qwe",
      }

      // When
      const response = await requester.post("/register").send(this.mockUser);
      // Then

      const cookieString = response.headers['set-cookie'][0];
      const cookieParts = cookieString.split(';');
      const [cookieNameAndValue] = cookieParts;
      const [cookieName, cookieValue] = cookieNameAndValue.split('=');
      cookie = cookieValue;

      expect(response.statusCode).to.equal(302);

    });



    it("Test login de usuario: Debe iniciar sesión correctamente un usuario", async function () {
      const mockLogin = {
        username: this.mockUser.username,
        password: this.mockUser.password
      };
      const response = await requester
        .post('/login')
        .set('CoderCookie', cookie)
        .send(mockLogin);
      expect(response.statusCode).to.equal(302);
    });

    it("Test login de usuario: Debe devolver un error si el usuario no existe", async function () {
      let mockLog;
      let cookiee = "123456789";

      const response = await requester
        .post('/login')
        .set('CoderCookie', cookiee)
        .send(mockLog);


      expect(response.statusCode).to.equal(401);
      });
  });
});





