"use server";
import { Lesson } from "@/model/lesson-model";
import { Module } from "@/model/module-model";
import { create } from "@/queries/lessons";
import mongoose from "mongoose";

export async function createLesson(data) {
  try {
    const title = data.get("title");
    const slug = data.get("slug");
    const moduleId = data.get("moduleId");
    const order = data.get("order");

    const createdLesson = await create({ title, slug, moduleId, order });

    const mymodule = await Module.findById(moduleId);
    mymodule.lessonIds.push(createdLesson?._id);
    await mymodule.save();
    return createdLesson;
  } catch (e) {
    console.error("createLesson error:", e);
    throw new Error();
  }
}
export async function updateLessonTitle(lessonId, data) {
  try {
    await Lesson.findByIdAndUpdate(lessonId, data);
  } catch (e) {
    throw new Error(e);
  }
}
export async function changeLessonPublishedState(lessonId) {
  try {
    const lesson = await Lesson.findById(lessonId);
    const res = await Lesson.findByIdAndUpdate(
      lessonId,
      { active: !lesson.active },
      { lean: true }
    );
    return res.active;
  } catch (err) {
    throw new Error(err);
  }
}

export async function deleteLesson(lessonId, moduleId) {
  try {
    const mymodule = await Module.findById(moduleId);
    mymodule.lessonIds.pull(new mongoose.Types.ObjectId(lessonId));
    await Lesson.findByIdAndDelete(lessonId);
    mymodule.save();
  } catch (err) {
    throw new Error(err);
  }
}
