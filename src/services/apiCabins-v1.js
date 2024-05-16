import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id, currentImage) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/Edit cabin (only if there is no ID as ID we use for edit)
  let query = supabase.from("cabins");

  // A) Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) Edit
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if there was an error uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded. Cabin was not created."
    );
  }

  // remove image from the supabase storage
  await supabase.storage.from("cabin-images").remove([currentImage]);

  return data;
}

export async function deleteCabin({ cabinId: id, imageName: image }) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  const { error: imageError } = await supabase.storage
    .from("cabin-images")
    .remove([image]);

  if (imageError) {
    console.log(imageError);
    throw new Error("Cabin deleted, but unable to delete image");
  }

  return data;
}

export async function copyCabinImage({ image }) {
  // const imageName = `${Math.random()}-${image}`.replaceAll("/", "");

  const { data, error } = await supabase.storage
    .from("cabin-images")
    .copyObject(image, `${image}-copy`);

  if (error) {
    console.log(error);
    throw new Error("Image failed to duplicate.");
  }

  const { imageCopy, errorImageCopy } = supabase.storage
    .from("cabin-images")
    .select(`${image}-copy`);

  if (errorImageCopy) {
    console.log(error);
    throw new Error("Failed to retrive image copy from database");
  }

  return imageCopy;
}
