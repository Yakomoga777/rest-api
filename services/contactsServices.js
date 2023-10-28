const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactPath = path.join(__dirname, "..", "db", "contacts.json");

const listContacts = async () => {
  const list = await fs.readFile(contactPath, "utf-8");
  return JSON.parse(list);
};

const getContactById = async (contactId) => {
  const allContacts = await listContacts();
  const contact = allContacts.find((c) => c.id === contactId);
  if (!contact) {
    return null;
  }
  return contact;
};

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  allContacts.push(newContact);

  await fs.writeFile(contactPath, JSON.stringify(allContacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const allContacts = await listContacts();

  const index = allContacts.findIndex((i) => i.id === contactId);
  if (index === -1) {
    return null;
  }

  const updatedContact = {
    ...allContacts[index],
    ...body,
  };

  allContacts[index] = updatedContact;

  await fs.writeFile(contactPath, JSON.stringify(allContacts, null, 2));

  return updatedContact;
};

const removeContact = async (contactId) => {
  const allContacts = await listContacts();

  const index = allContacts.findIndex((i) => i.id === contactId);
  if (index === -1) {
    return null;
  }
  const removedContact = allContacts[index];
  allContacts.splice(index, 1);

  await fs.writeFile(contactPath, JSON.stringify(allContacts, null, 2));
  return removedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  contactPath,
};
