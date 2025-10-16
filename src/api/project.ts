import { get, post, put, del } from './request';
import type { ApiResult, PageResult } from 'src/types/common';
import type { 
  Project, 
  ProjectQuery, 
  ProjectCreateDto, 
  ProjectUpdateDto,
  ProjectMember,
  ProjectMemberDto,
  BatchAddProjectMembersDto,
  BatchAddMembersResult
} from 'src/types/project';

/**
 * 项目管理API
 */
export const projectApi = {
  /**
   * 创建项目
   * @param data 项目数据
   */
  createProject: (data: ProjectCreateDto) => {
    return post<ApiResult<void>>('/project/create', data);
  },

  /**
   * 获取项目列表（分页）
   * @param query 查询参数
   */
  getProjectList: (query: ProjectQuery) => {
    return get<ApiResult<PageResult<Project>>>('/project/list', query);
  },

  /**
   * 查询项目
   * @param uuid 项目ID（可选，不传则返回所有项目）
   */
  getProject: (uuid?: string) => {
    return get<ApiResult<Project[]>>('/project/get', uuid ? { uuid } : undefined);
  },

  /**
   * 更新项目
   * @param data 项目数据
   */
  updateProject: (data: ProjectUpdateDto) => {
    return put<ApiResult<void>>('/project/update', data);
  },

  /**
   * 删除项目
   * @param uuid 项目ID
   */
  deleteProject: (uuid: string) => {
    return del<ApiResult<void>>('/project/delete', { uuid });
  },

  /**
   * 查询我的项目
   * @returns 当前用户参与的所有项目
   */
  getMyProjects: () => {
    return get<ApiResult<Project[]>>('/project/my-projects');
  },

  /**
   * 添加项目成员
   * @param data 项目成员数据
   */
  addProjectMember: (data: ProjectMemberDto) => {
    return post<ApiResult<void>>('/project/member/add', data);
  },

  /**
   * 批量添加项目成员
   * @param data 批量添加项目成员数据
   */
  batchAddProjectMembers: (data: BatchAddProjectMembersDto) => {
    return post<ApiResult<BatchAddMembersResult>>('/project/member/batch-add', data);
  },

  /**
   * 移除项目成员
   * @param uuid 项目成员ID
   */
  removeProjectMember: (uuid: string) => {
    return del<ApiResult<void>>('/project/member/remove', { uuid });
  },

  /**
   * 查询项目成员列表
   * @param projectName 项目名称
   */
  getProjectMembers: (projectName: string) => {
    return get<ApiResult<ProjectMember[]>>('/project/member/list', { projectName });
  },
};
