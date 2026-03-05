import { createServerFn } from '@tanstack/react-start'
import { categoryRepository } from '../repository/category.repository'
import {
  categoryFilterSchema,
  createCategorySchema,
} from '../schema/category.schema'
import {
  categoryIdSchema,
  deleteCategoryPayloadSchema,
  updateCategoryPayloadSchema,
} from './category-server.schema'
import { normalizeOptionalField, toCategory, toCategoryList } from './category-utils'
import { requireCurrentUser } from './require-current-user'

export const listCategories = createServerFn({ method: 'GET' })
  .inputValidator(categoryFilterSchema.optional())
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const categories = await categoryRepository.findAllByUser(user.id, data)

    return toCategoryList(categories)
  })

export const listCategoryTree = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireCurrentUser()
    return categoryRepository.findTree(user.id)
  },
)

export const getCategory = createServerFn({ method: 'GET' })
  .inputValidator(categoryIdSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const category = await categoryRepository.findById(data.id, user.id)

    if (!category) {
      throw new Error('Category not found')
    }

    return toCategory(category)
  })

export const createCategory = createServerFn({ method: 'POST' })
  .inputValidator(createCategorySchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()

    if (data.parentId) {
      const parent = await categoryRepository.findById(data.parentId, user.id)
      if (!parent) {
        throw new Error('Parent category not found')
      }

      if (parent.type !== data.type) {
        throw new Error('Parent category must have the same type')
      }
    }

    const category = await categoryRepository.create({
      userId: user.id,
      name: data.name,
      type: data.type,
      color: normalizeOptionalField(data.color),
      icon: normalizeOptionalField(data.icon),
      parentId: normalizeOptionalField(data.parentId),
    })

    return toCategory(category)
  })

export const updateCategory = createServerFn({ method: 'POST' })
  .inputValidator(updateCategoryPayloadSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const existing = await categoryRepository.findById(data.id, user.id)

    if (!existing) {
      throw new Error('Category not found')
    }

    const requestedParentId = data.data.parentId
    const nextParentId =
      requestedParentId !== undefined ? requestedParentId : existing.parentId

    if (nextParentId) {
      if (nextParentId === existing.id) {
        throw new Error('Category cannot be its own parent')
      }

      const parent = await categoryRepository.findById(nextParentId, user.id)
      if (!parent) {
        throw new Error('Parent category not found')
      }

      const nextType = data.data.type ?? existing.type
      if (parent.type !== nextType) {
        throw new Error('Parent category must have the same type')
      }
    }

    const category = await categoryRepository.update(data.id, user.id, {
      ...data.data,
      color:
        data.data.color !== undefined
          ? normalizeOptionalField(data.data.color)
          : undefined,
      icon:
        data.data.icon !== undefined
          ? normalizeOptionalField(data.data.icon)
          : undefined,
      parentId:
        data.data.parentId !== undefined
          ? normalizeOptionalField(data.data.parentId)
          : undefined,
    })

    if (!category) {
      throw new Error('Category not found')
    }

    return toCategory(category)
  })

export const deleteCategory = createServerFn({ method: 'POST' })
  .inputValidator(deleteCategoryPayloadSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser()
    const result = await categoryRepository.delete(data.id, user.id, {
      deleteChildren: data.deleteChildren,
    })

    if (!result.deleted) {
      if (result.reason === 'HAS_TRANSACTIONS') {
        if (data.deleteChildren) {
          throw new Error(
            'Category and its sub-categories cannot be deleted because one or more have transactions',
          )
        }

        throw new Error('Category cannot be deleted because it has transactions')
      }

      if (result.reason === 'HAS_CHILDREN') {
        throw new Error(
          'Category cannot be deleted because it has sub-categories. Enable delete with children to continue.',
        )
      }

      throw new Error('Category not found')
    }

    return { success: true }
  })

export const seedDefaultCategories = createServerFn({ method: 'POST' }).handler(
  async () => {
    const user = await requireCurrentUser()
    const categories = await categoryRepository.seedDefaults(user.id)

    return toCategoryList(categories)
  },
)
