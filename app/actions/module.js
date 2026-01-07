"use server";
import { Course } from "@/model/course-model";
import { Module } from "@/model/module-model";
import { create } from "@/queries/modules";
import mongoose from "mongoose";

export async function createModule(data) {
  try {
    const title = data.get("title");
    const slug = data.get("slug");
    const courseId = data.get("courseId");
    const order = data.get("order");

    const createdModule = await create({
      title,
      slug,
      course: courseId,
      order,
    });

    const course = await Course.findById(courseId);
    course.modules.push(createdModule._id);
    await course.save();

    // Return a plain object
    return {
      id: createdModule._id.toString(),
      title: createdModule.title,
      slug: createdModule.slug,
      order: createdModule.order,
    };
  } catch (e) {
    throw e;
  }
}

export async function reOrderModules(data) {
  try {
    await Promise.all(
      data.map(async (element) => {
        await Module.findByIdAndUpdate(element.id, {
          order: element.position,
        });
      })
    );
  } catch (e) {
    throw new Error(e);
  }
}
export async function updateModuleTitle(moduleId, newTitle) {
  try {
    await Module.findByIdAndUpdate(moduleId, newTitle);
  } catch (e) {
    throw new Error(e);
  }
}

export async function changeModulePublishedState(moduleId) {
  try {
    const mymodule = await Module.findById(moduleId);
    const res = await Module.findByIdAndUpdate(
      moduleId,
      {
        active: !mymodule.active,
      },
      { lean: true }
    );
    return res.active;
  } catch (err) {
    throw new Error(err);
  }
}
export async function deleteModule(moduleId, courseId) {
  try {
    const course = await Course.findById(courseId);
    course.modules.pull(new mongoose.Types.ObjectId(moduleId));
    course.save();

    await Module.findByIdAndDelete(moduleId);
  } catch (err) {
    throw new Error(err);
  }
}
