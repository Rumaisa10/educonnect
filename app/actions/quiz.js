"use server";

import { getSlug } from "@/lib/convertData";
import { Quizset } from "@/model/quizset-model";
import { createQuiz } from "@/queries/quizzes";

export async function updateQuizSet(quizSetId, data) {
  try {
    const updatedQuizSet = await Quizset.findByIdAndUpdate(quizSetId, data);
    return updateQuizSet;
  } catch (e) {
    throw new Error(e);
  }
}

export async function addQuizToQuizSet(quizSetId, data) {
  try {
    const transformedQuizData = {};
    transformedQuizData["title"] = data["title"];
    transformedQuizData["description"] = data["description"];
    transformedQuizData["slug"] = getSlug(data["title"]);
    transformedQuizData["option"] = [
      {
        text: data.optionA.label,
        is_correct: data.optionA.isTrue,
      },
      {
        text: data.optionB.label,
        is_correct: data.optionB.isTrue,
      },
      {
        text: data.optionC.label,
        is_correct: data.optionC.isTrue,
      },
      {
        text: data.optionD.label,
        is_correct: data.optionD.isTrue,
      },
    ];
    const createdQuizId = await createQuiz(transformedQuizData);
    const quizSet = await Quizset.findById(quizSetId);

    quizSet.quizIds.push(createdQuizId);
    await quizSet.save();
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function doCreateQuizSet(data) {
  try {
    data["slug"] = getSlug(data.tite);
    const craetedQuizSet = await Quizset.create(data);
    return craetedQuizSet?._id.toString();
  } catch (e) {
    console.error("doCreateQuizSet error:", e);
    throw new Error(e);
  }
}
