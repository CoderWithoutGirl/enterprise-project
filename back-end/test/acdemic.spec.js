const dotenv = require("dotenv");
dotenv.config();
const db = require("../persistance/db");
const mongoose = require("mongoose");
const academicModel = require("../model/academicYear");

const {
  createAcademicYear,
  getAcademicYear,
} = require("../service/academic.service");

beforeAll(() => {
  db.connect("mongodb://localhost:27017/test-enterprise-project");
});

describe("GET /academic/", () => {
  it("Test should return all academic from database", async () => {
    const result = await getAcademicYear();
    expect(result).toBeTruthy();
  });
});

describe("POST /academic/", () => {
  it("Test create academicYear with correct value", async () => {
    const newAcademicYear = await createAcademicYear({
      name: "test full",
      startDate: "2022-03-03T17:00:00.000Z",
      endDate: "2022-03-18T17:00:00.000Z",
      closureDate: "2022-03-12T00:00:00.000Z",
    });

    expect(newAcademicYear).toBeTruthy();
  });

  it("Test academicYear with the name existed", async () => {
    try {
      const newAcademicYear = await createAcademicYear({
        name: "test full",
        startDate: "2022-03-03T17:00:00.000Z",
        endDate: "2022-03-18T17:00:00.000Z",
        closureDate: "2022-03-12T00:00:00.000Z",
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it("Test academicYear with null value", async () => {
    try {
      const newAcademicYear = await createAcademicYear({
        name: "",
        startDate: "",
        endDate: "",
        closureDate: "",
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it("Test academicYear with the end date not after start date", async () => {
    try {
      const newAcademicYear = await createAcademicYear({
        name: "test full 3",
        startDate: "2022-03-03T17:00:00.000Z",
        endDate: "2022-02-18T17:00:00.000Z",
        closureDate: "2022-03-12T00:00:00.000Z",
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it("Test academicYear with the closure date not after start date and before end date", async () => {
    try {
      const newAcademicYear = await createAcademicYear({
        name: "test full 4",
        startDate: "2022-03-03T17:00:00.000Z",
        endDate: "2022-03-18T17:00:00.000Z",
        closureDate: "2022-03-20T00:00:00.000Z",
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});

afterAll(() => {
  mongoose.disconnect();
});
