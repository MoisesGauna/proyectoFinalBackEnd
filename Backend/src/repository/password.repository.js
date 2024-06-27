export default class PasswordRepository {
  constructor(dao) {
    this.dao = dao;
  }
  createPswInfo = (pswInfo) => {
    return this.dao.createPswInfo(pswInfo);
  };

  getPswInfoByToken = (token) => {
    return this.dao.getPswInfoByToken(token);
  };

  deletePswInfo = (id) => {
    return this.dao.deletePswInfo(id);
  };
}
