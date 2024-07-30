const express = require('express');
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const findUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        id: "desc"
      }
    })

    res.status(200).send({
      success: true,
      message: 'Get all users successfully',
      data: users
    })
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    })
  }
}

const createUser = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    })
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      }
    })

    res.status(201).send({
      success: true,
      message: 'User created successfully',
      data: user
    })
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    })
  }
}

const findUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Get user by ID : ${id} failed. User not found`
      })
    }

    res.status(200).send({
      success: true,
      message: `Get user by ID : ${id} successfully`,
      data: user,
    })
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    })
  }
}

module.exports = { findUsers, createUser, findUserById };