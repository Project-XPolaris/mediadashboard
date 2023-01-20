import {youComicRequest} from "@/services/youcomic/client";

export type UserListQuery = {
  page: number;
  page_size: number;
}
export const fetchUserList = async (query: UserListQuery) => {
  return youComicRequest.get('/users', {params: query});
}

export const fetchUserGroups = async () => {
  return youComicRequest.get('/usersgroups');
}

export const fetchPermissionList = async () => {
  return youComicRequest.get('/permissions');
}
