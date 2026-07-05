<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_todos(): void
    {
        Todo::factory()->count(3)->create();

        $response = $this->getJson('/api/todos');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_todo(): void
    {
        $response = $this->postJson('/api/todos', [
            'title' => 'Test Todo',
            'description' => 'Test Description',
            'completed' => false,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'title' => 'Test Todo',
                'description' => 'Test Description',
                'completed' => false,
            ]);

        $this->assertDatabaseHas('todos', [
            'title' => 'Test Todo',
        ]);
    }

    public function test_can_show_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->getJson("/api/todos/{$todo->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $todo->id,
                'title' => $todo->title,
            ]);
    }

    public function test_can_update_todo(): void
    {
        $todo = Todo::factory()->create(['completed' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'completed' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $todo->id,
                'completed' => true,
            ]);

        $this->assertDatabaseHas('todos', [
            'id' => $todo->id,
            'completed' => true,
        ]);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->deleteJson("/api/todos/{$todo->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Todo deleted successfully']);

        $this->assertDatabaseMissing('todos', ['id' => $todo->id]);
    }

    public function test_validates_required_title(): void
    {
        $response = $this->postJson('/api/todos', [
            'description' => 'Test Description',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }
}
