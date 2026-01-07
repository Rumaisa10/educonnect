import { replaceMongoIdInObject } from "@/lib/convertData";
import { Lesson } from "@/model/lesson-model";
import { Module } from "@/model/module-model";

export async function create(moduleData) {
  try {
    const mymodule = await Module.create(moduleData);
    return JSON.parse(JSON.stringify(mymodule));
  } catch (e) {
    throw new Error(e);
  }
}
export async function getModule(moduleId) {
  try {
    const mymodule = await Module.findById(moduleId)
      .populate({
        path: "lessonIds",
        model: Lesson,
      })
      .lean();
    return replaceMongoIdInObject(mymodule);
  } catch (e) {
    throw new Error(e.message);
  }
}
